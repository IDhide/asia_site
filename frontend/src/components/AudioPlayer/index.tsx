// index.tsx
'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import styles from './style.module.scss';

interface AudioPlayerProps {
    src?: string;
}

const BARS_COUNT = 5;

export function AudioPlayer({ src = '/assets/songs/song.mp3' }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [levels, setLevels] = useState<number[]>(() => Array(BARS_COUNT).fill(0));

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const contextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const currentLevelsRef = useRef<number[]>(Array(BARS_COUNT).fill(0));
    const animationFrameRef = useRef<number | null>(null);

    const initAudio = () => {
        if (audioRef.current && !contextRef.current) {
            const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
            const context = new AudioContext();
            contextRef.current = context;

            // Создаём источник
            const source = context.createMediaElementSource(audioRef.current);
            sourceRef.current = source;

            // Анализатор
            const analyser = context.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.3;
            analyserRef.current = analyser;

            // Процессор для onaudioprocess
            const processor = context.createScriptProcessor(2048, 1, 1);
            processorRef.current = processor;

            // Связываем
            source.connect(analyser);
            analyser.connect(processor);
            processor.connect(context.destination);
            source.connect(context.destination);

            // Обработка данных
            processor.onaudioprocess = () => {
                if (!analyserRef.current || audioRef.current?.paused) return;

                const freqData = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(freqData);

                // Делим на 5 полос
                const segment = Math.floor(freqData.length / BARS_COUNT);
                const rawLevels: number[] = [];

                for (let i = 0; i < BARS_COUNT; i++) {
                    let sum = 0;
                    const start = i * segment;
                    const end = i === BARS_COUNT - 1 ? freqData.length : start + segment;
                    for (let j = start; j < end; j++) {
                        sum += freqData[j];
                    }
                    const avg = sum / (end - start);
                    let level = avg / 255;

                    // Усиливаем
                    level = Math.pow(level, 0.6) * 1.6;
                    level = Math.max(0, level - 0.01);
                    level = Math.min(1, level);

                    rawLevels[i] = level;
                }

                // СГЛАЖИВАНИЕ соседей
                const smoothed = rawLevels.map((val, i, arr) => {
                    const prev = i > 0 ? arr[i - 1] : val;
                    const next = i < BARS_COUNT - 1 ? arr[i + 1] : val;
                    return val * 0.65 + prev * 0.175 + next * 0.175;
                });

                // Плавный подъём + спад
                const updated = smoothed.map((target, i) => {
                    const curr = currentLevelsRef.current[i] || 0;
                    if (target > curr) {
                        return curr + (target - curr) * 0.9;
                    } else {
                        return Math.max(curr - 0.025, target);
                    }
                });

                currentLevelsRef.current = updated;
                setLevels(updated);
            };
        }
    };

    const togglePlay = async () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            try {
                initAudio();
                if (contextRef.current?.state === 'suspended') {
                    await contextRef.current.resume();
                }
                audioRef.current.currentTime = 0;
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                console.error('Play failed', err);
                setIsPlaying(false);
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePlay();
        }
    };

    useEffect(() => {
        return () => {
            contextRef.current?.close();
        };
    }, []);

    return (
        <>
            <audio ref={audioRef} src={src} preload="auto" />

            <button
                className={`${styles.audioButton} ${isPlaying ? styles.isPlaying : ''}`}
                onClick={togglePlay}
                onKeyDown={handleKeyDown}
                aria-label={isPlaying ? 'Остановить' : 'Воспроизвести'}
                type="button"
            >
                <img src="/assets/main/music.svg" alt="" className={styles.icon} />
                {isPlaying && <Equalizer levels={levels} />}
            </button>
        </>
    );
}

// 5 СИММЕТРИЧНЫХ ПАЛОЧЕК — РАСШИРЯЮТСЯ ОТ ЦЕНТРА
function Equalizer({ levels }: { levels: number[] }) {
    const height = 24;
    const center = height / 2;

    return (
        <span className={styles.eq}>
            {levels.map((level, i) => {
                const size = 4 + level * 18; // 4 → 22px
                return (
                    <span
                        key={i}
                        className={styles.eqBar}
                        style={{
                            height: `${size}px`,
                            top: `${center - size / 2}px`,
                        }}
                    />
                );
            })}
        </span>
    );
}