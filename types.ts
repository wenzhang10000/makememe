
export interface StickerConfig {
  text: string;
  bgColor: string;
  textColor: string;
  avatarUrl: string | null;
  avatarScale: number; // New field for avatar size
  aspectRatio: '16:9' | '1:1' | '9:16'; // New field for canvas ratio
  fontSize: number;
  showPointer: boolean;
}

export interface SloganSuggestion {
  text: string;
  category: string;
}
