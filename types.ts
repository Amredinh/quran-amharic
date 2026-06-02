export interface Aya {
  index: number;
  text: string;
  bismillah?: string;
}

export interface Sura {
  index: number;
  name: string; // Arabic name
  englishName?: string;
  nameAmh?: string;
  meaningAmh?: string;
  ayahsCount?: number;
  revelationType?: 'Makkiyah' | 'Madaniyah';
  revelationTypeAmh?: string;
  ayas: Aya[];
  revelationOrder?: number; // Mock data for sorting
}

export interface QuranData {
  suras: Sura[];
}

export interface Reciter {
  name: string;
  subfolder: string; // part of url like 'basit' or 'maher' or everyayah directory identifier
  isEveryAyah?: boolean; // flag to distinguish audio type
}

export interface FavoriteItem {
  id: string; // Unique id like `sura-${id}` or `ayah-${suraId}-${index}`
  type: 'surah' | 'ayah';
  suraId: number;
  suraName: string;
  ayahIndex?: number; // index inside array
  ayahNo?: number; // 1-based number
  textArab?: string;
  textTrans?: string;
}


export interface Translation {
  id: string; // 'am' or 'orom'
  name: string; // 'Amharic'
  data: QuranData; // Parsed XML content
}

export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
}

export interface Settings {
  arabicFontSize: number;
  translationFontSize: number;
  showArabic: boolean;
  showTranslation: boolean;
  theme: 'book' | 'paper' | 'default';
}
