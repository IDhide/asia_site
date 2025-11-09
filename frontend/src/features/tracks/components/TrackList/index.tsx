import type { Track } from '@/types/track';
import { TrackCard } from '../TrackCard';
import styles from './style.module.scss';

interface TrackListProps {
  tracks: Track[];
}

export function TrackList({ tracks }: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Треки пока не добавлены</p>
      </div>
    );
  }

  return (
    <div className={styles.trackList}>
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  );
}
