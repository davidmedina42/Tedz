export type Category =
  | "Productivity"
  | "Psychology"
  | "Leadership"
  | "Technology"
  | "Science"
  | "Creativity";

export const CATEGORIES: Category[] = [
  "Productivity",
  "Psychology",
  "Leadership",
  "Technology",
  "Science",
  "Creativity",
];

export interface Clip {
  id: string;
  title: string;
  speaker: string;
  speakerTitle?: string;
  youtubeId: string;
  startSeconds: number;
  endSeconds: number;
  keyTakeaway: string;
  category: Category;
  tags?: string[];
  likesCount: number;
  savedCount: number;
}
