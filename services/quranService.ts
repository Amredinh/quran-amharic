import { QuranData, Sura, Aya } from '../types';
import { SURAH_METADATA } from './surahMetadata';

export const parseQuranXML = (xmlContent: string): QuranData => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
  
  const suras: Sura[] = Array.from(xmlDoc.getElementsByTagName("sura")).map((suraNode) => {
    const index = parseInt(suraNode.getAttribute("index") || "0");
    const name = suraNode.getAttribute("name") || "";
    
    // Check if XML has extra attributes
    const xmlMeaning = suraNode.getAttribute("meaning") || undefined;
    const xmlAyahs = suraNode.getAttribute("ayahs") ? parseInt(suraNode.getAttribute("ayahs")!) : undefined;
    const xmlType = suraNode.getAttribute("type") || undefined;
    const xmlEnglish = suraNode.getAttribute("englishName") || undefined;

    // Load static metadata as fallback/enrichment
    const staticMeta = SURAH_METADATA.find(m => m.id === index);

    const ayas: Aya[] = Array.from(suraNode.getElementsByTagName("aya")).map((ayaNode) => ({
      index: parseInt(ayaNode.getAttribute("index") || "0"),
      text: ayaNode.getAttribute("text") || "",
      bismillah: ayaNode.getAttribute("bismillah") || undefined
    }));

    return { 
      index, 
      name: name || staticMeta?.nameAmh || staticMeta?.nameEn || "", 
      englishName: xmlEnglish || staticMeta?.nameEn,
      nameAmh: staticMeta?.nameAmh,
      meaningAmh: xmlMeaning || staticMeta?.meaningAmh,
      ayahsCount: xmlAyahs || staticMeta?.ayahCount || ayas.length,
      revelationType: staticMeta?.type,
      revelationTypeAmh: xmlType || staticMeta?.typeAmh,
      ayas 
    };
  });

  return { suras };
};

export const getAyahAudioUrl = (surahIndex: number, ayahIndex: number, reciterSubfolder?: string): string => {
  // Format: 001001.mp3 (3 digits for Surah, 3 digits for Ayah)
  const padSurah = surahIndex.toString().padStart(3, '0');
  const padAyah = ayahIndex.toString().padStart(3, '0');
  const folder = reciterSubfolder || 'AbdulSamad_64kbps_QuranExplorer.Com';
  return `https://everyayah.com/data/${folder}/${padSurah}${padAyah}.mp3`;
};

export const getFullSurahAudioUrl = (reciterFolder: string, surahIndex: number): string => {
  const padSurah = surahIndex.toString().padStart(3, '0');
  return `https://server${getReciterServer(reciterFolder)}.mp3quran.net/${reciterFolder}/${padSurah}.mp3`;
};

// Helper to guess server number based on prompt links, defaults to 7 if unknown
const getReciterServer = (folder: string): string => {
    const map: Record<string, string> = {
        'basit': '7',
        'maher': '12',
        'afs': '8',
        's_gmd': '7',
        'sds': '11',
        'jhn': '13',
        'mtrod': '8',
        'ajm': '10',
        'husr': '13',
        'abkr': '6'
    };
    return map[folder] || '7';
}
