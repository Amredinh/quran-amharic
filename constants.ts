import { Reciter, Sura, Blog } from './types';

export const RECITERS: Reciter[] = [
  { name: 'Abdulbasit Abdulsamad', subfolder: 'basit' },
  { name: 'Maher Al-Meaqli', subfolder: 'maher' },
  { name: 'Mishary Alafasi', subfolder: 'afs' },
  { name: 'Saad Al-Ghamdi', subfolder: 's_gmd' },
  { name: 'Abdulrahman Al-Sudaes', subfolder: 'sds' },
  { name: 'Abdullah Al-Johany', subfolder: 'jhn' },
  { name: 'Abdullah Al-Mattrod', subfolder: 'mtrod' },
  { name: 'Ahmad Al-Ajmy', subfolder: 'ajm' },
  { name: 'Mahmoud Khalil Al-Hussary', subfolder: 'husr' },
  { name: 'Idrees Abkr', subfolder: 'abkr' },
];

export const MOCK_ARABIC_XML = `
<quran>
<sura index="1" name="الفاتحة">
<aya index="1" text="بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ"/>
<aya index="2" text="الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"/>
<aya index="3" text="الرَّحْمَـٰنِ الرَّحِيمِ"/>
<aya index="4" text="مَالِكِ يَوْمِ الدِّينِ"/>
<aya index="5" text="إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"/>
<aya index="6" text="اهْدِنَا الصِّرَاطَ الْمُس្តَقِيمَ"/>
<aya index="7" text="صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"/>
</sura>
<sura index="112" name="الإخلاص">
<aya index="1" text="قُلْ هُوَ اللَّهُ أَحَدٌ" bismillah="بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ"/>
<aya index="2" text="اللَّهُ الصَّمَدُ"/>
<aya index="3" text="لَمْ يَلِدْ وَلَمْ يُولَدْ"/>
<aya index="4" text="وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ"/>
</sura>
<sura index="113" name="الفلق">
<aya index="1" text="قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ" bismillah="بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ"/>
<aya index="2" text="مِن شَرِّ مَا خَلَقَ"/>
<aya index="3" text="وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ"/>
<aya index="4" text="وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ"/>
<aya index="5" text="وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ"/>
</sura>
<sura index="114" name="الناس">
<aya index="1" text="قُلْ أَعُوذُ بِرَبِّ النَّاسِ" bismillah="بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ"/>
<aya index="2" text="مَلِكِ النَّاسِ"/>
<aya index="3" text="إِلَـٰهِ النَّاسِ"/>
<aya index="4" text="مِن شَرِّ الْوَسْዋስِ الْخَنَّاسِ"/>
<aya index="5" text="الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ"/>
<aya index="6" text="مِنَ الْجِنَّةِ وَالنَّاسِ"/>
</sura>
</quran>
`;

export const MOCK_AMHARIC_XML = `
<quran>
<sura index="1" name="መክፈቻ">
<aya index="1" text="በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው።"/>
<aya index="2" text="ምስጋና ለአላህ ይገባው የዓለማት ጌታ ለሆነው፤"/>
<aya index="3" text="እጅግ በጣም ሩኅሩህ በጣም አዛኝ፤"/>
<aya index="4" text="የፍርድ ቀን ባለቤት ለሆነው።"/>
<aya index="5" text="አንተን ብቻ እንገዛለን፤ አንተንም ብቻ እርዳታን እንጠይቃለን።"/>
<aya index="6" text="ቀጥተኛውን መንገድ ምራን።"/>
<aya index="7" text="የነዚያን በነርሱ ላይ በጎን የዋልክላቸውን ሰዎች መንገድ (ምራን)፤ በነሱ ላይ የተቆጣህባቸውና (ከመንገድ) የጠፉትን ሰዎች መንገድ አይደለም።"/>
</sura>
<sura index="112" name="ፅድት ማለት">
<aya index="1" text="በል፡- እርሱ አላህ አንድ ነው።" bismillah="በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው።"/>
<aya index="2" text="አላህ (የሁሉ) መጠጊያ ነው።"/>
<aya index="3" text="አልወለደም አልተወለደምም።"/>
<aya index="4" text="ለእርሱም አንድም ብጤ የለውም።"/>
</sura>
<sura index="113" name="መንጋት">
<aya index="1" text="በል፡- በሌሊት ጌታ እጠበቃለሁ።" bismillah="በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው።"/>
<aya index="2" text="ከፈጠረው ፍጡር ሁሉ ክፋት።"/>
<aya index="3" text="ከሌሊትም ክፋት በጨለመ ጊዜ።"/>
<aya index="4" text="በድሮችም ላይ ተፉዎች ከሆኑት (ጠንቋዮች) ክፋት።"/>
<aya index="5" text="ከምቀኛም ክፋት በተቀና ጊዜ (እጠበቃለሁ በል)።"/>
</sura>
<sura index="114" name="ሰዎች">
<aya index="1" text="በል፡- በሰዎች ጌታ እጠበቃለሁ።" bismillah="በአላህ ስም እጅግ በጣም ሩኅሩህ በጣም አዛኝ በሆነው።"/>
<aya index="2" text="የሰዎች ንጉሥ በሆነው።"/>
<aya index="3" text="የሰዎች አምላክ በሆነው።"/>
<aya index="4" text="ከድብቁ ጎትጓች ክፋት።"/>
<aya index="5" text="ከዚያ በሰዎች ልቦች ውስጥ የሚጎተጉት ከሆነው።"/>
<aya index="6" text="ከጂኒዎችም ከሰዎችም (ከሆነው ጎትጓች እጠበቃለሁ በል)።"/>
</sura>
</quran>
`;

export const SURAH_NAMES_EN = [
  "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Ad-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

export const REVELATION_ORDER: number[] = [
  96, 68, 73, 74, 1, 111, 81, 87, 92, 89, 93, 94, 103, 100, 108, 102, 107, 109, 105, 113, 114, 112, 53, 80, 97, 91, 85, 95, 106, 101, 75, 104, 77, 50, 90, 86, 54, 38, 7, 72, 36, 25, 35, 19, 20, 56, 26, 27, 28, 17, 10, 11, 12, 15, 6, 37, 31, 34, 39, 40, 41, 42, 43, 44, 45, 46, 51, 88, 18, 16, 71, 14, 21, 23, 32, 52, 67, 69, 70, 78, 79, 82, 84, 30, 29, 83, 2, 8, 3, 33, 60, 4, 99, 57, 47, 13, 55, 76, 65, 98, 59, 110, 24, 22, 63, 58, 49, 66, 64, 61, 62, 48, 5, 9
];

export const BLOG_POSTS: Blog[] = [
  {
    id: 1,
    title: "Understanding the Revelation of Surah Al-Alaq",
    excerpt: "The first revealed surah holds deep significance...",
    content: "The revelation of Surah Al-Alaq marks the beginning of the Quranic journey. 'Iqra' or 'Read' was the first command given to Prophet Muhammad (PBUH) in the cave of Hira. This command highlights the supreme importance of knowledge, education, and literacy in the Islamic faith. Understanding this surah allows believers to appreciate the value of learning as a gateway to spiritual enlightenment and a closer relationship with the Creator.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    date: "Oct 24, 2023"
  },
  {
    id: 2,
    title: "The Importance of Tajweed",
    excerpt: "Why reciting the Quran correctly matters.",
    content: "Tajweed is the set of rules governing the pronunciation of Quranic letters. It is not merely about aesthetics; it is about preserving the divine message exactly as it was revealed. Incorrect pronunciation can, in some cases, alter the meaning of the words entirely. By studying Tajweed, believers ensure they are honoring the text and fulfilling the duty of 'reciting the Quran in slow, measured tones' as commanded in Surah Al-Muzzammil.",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800",
    date: "Oct 20, 2023"
  }
];