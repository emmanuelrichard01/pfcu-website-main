
export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  sermon_date: string;
  description: string | null;
  duration: string | null;
  audio_url: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at?: string;
}

export interface SermonFormData {
  title: string;
  preacher: string;
  sermon_date: string;
  description: string | null;
  duration: string | null;
  audio_file: File | null;
  cover_image: File | null;
}
