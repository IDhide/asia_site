export interface Album {
  id: number;
  slug: string;
  title: string;
  artist: string;
  year: number | null;
  cover: string | null;
  description: string;
  order: number;
  tracks_count?: number;
  tracks?: Track[];
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: number;
  slug: string;
  title: string;
  artist: string;
  year: number | null;
  album: {
    id: number;
    slug: string;
    title: string;
    year?: number | null;
    cover?: string | null;
  } | null;
  order: number;
  audio: string;        // URL to audio file
  cover: string | null; // URL to cover image
  lyrics: string;
  created_at: string;
  updated_at: string;
}

// Общий тип для элементов слайдера (трек или альбом)
export type SliderItem = Track | Album;
