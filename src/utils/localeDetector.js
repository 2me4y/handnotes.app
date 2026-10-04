/**
 * Locale detection engine for handnotes.app
 * 
 * Determines language ('ru' | 'en') automatically:
 * 1. Saved localStorage setting (explicit user choice).
 * 2. URL search parameters (?lang=ru, ?lang=en, ?hl=ru).
 * 3. Browser language (navigator.languages / navigator.language).
 * 4. User timezone heuristic for CIS / Post-Soviet countries:
 *    (Russia, Belarus, Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan,
 *     Armenia, Azerbaijan, Georgia, Moldova, Turkmenistan, Ukraine).
 * 5. Default fallback: 'en' for global audience.
 */

const CIS_LANG_PREFIXES = [
  'ru', // Russian
  'uk', // Ukrainian
  'be', // Belarusian
  'kk', // Kazakh
  'ky', // Kyrgyz
  'uz', // Uzbek
  'tg', // Tajik
  'az', // Azerbaijani
  'hy', // Armenian
  'ka', // Georgian
  'mo', // Moldavian
  'tk', // Turkmen
];

const CIS_TIMEZONES = new Set([
  // Russia
  'Europe/Moscow',
  'Europe/Kaliningrad',
  'Europe/Kirov',
  'Europe/Astrakhan',
  'Europe/Saratov',
  'Europe/Ulyanovsk',
  'Europe/Samara',
  'Europe/Volgograd',
  'Asia/Yekaterinburg',
  'Asia/Omsk',
  'Asia/Novosibirsk',
  'Asia/Novokuznetsk',
  'Asia/Barnaul',
  'Asia/Tomsk',
  'Asia/Krasnoyarsk',
  'Asia/Irkutsk',
  'Asia/Chita',
  'Asia/Yakutsk',
  'Asia/Khandyga',
  'Asia/Vladivostok',
  'Asia/Ust-Nera',
  'Asia/Magadan',
  'Asia/Sakhalin',
  'Asia/Srednekolymsk',
  'Asia/Kamchatka',
  'Asia/Anadyr',
  // Belarus
  'Europe/Minsk',
  // Ukraine
  'Europe/Kyiv',
  'Europe/Kiev',
  'Europe/Uzhgorod',
  'Europe/Zaporozhye',
  // Moldova
  'Europe/Chisinau',
  'Europe/Tiraspol',
  // Kazakhstan
  'Asia/Almaty',
  'Asia/Qyzylorda',
  'Asia/Qostanay',
  'Asia/Aqtobe',
  'Asia/Aqtau',
  'Asia/Atyrau',
  'Asia/Oral',
  // Uzbekistan
  'Asia/Tashkent',
  'Asia/Samarkand',
  // Kyrgyzstan
  'Asia/Bishkek',
  // Tajikistan
  'Asia/Dushanbe',
  // Turkmenistan
  'Asia/Ashgabat',
  // Armenia
  'Asia/Yerevan',
  // Azerbaijan
  'Asia/Baku',
  // Georgia
  'Asia/Tbilisi',
]);

/**
 * Checks whether user timezone belongs to CIS region
 */
function isCISTimezone() {
  try {
    const tz = (typeof Intl !== 'undefined' && Intl.DateTimeFormat)
      ? new Intl.DateTimeFormat().resolvedOptions().timeZone
      : '';
    if (!tz) return false;
    if (CIS_TIMEZONES.has(tz)) return true;
    
    // Fuzzy check for any Russian or Central Asian zones
    const lowerTz = tz.toLowerCase();
    if (
      lowerTz.includes('moscow') ||
      lowerTz.includes('samara') ||
      lowerTz.includes('yekaterinburg') ||
      lowerTz.includes('novosibirsk') ||
      lowerTz.includes('krasnoyarsk') ||
      lowerTz.includes('irkutsk') ||
      lowerTz.includes('vladivostok') ||
      lowerTz.includes('almaty') ||
      lowerTz.includes('tashkent') ||
      lowerTz.includes('minsk') ||
      lowerTz.includes('kyiv') ||
      lowerTz.includes('kiev') ||
      lowerTz.includes('bishkek') ||
      lowerTz.includes('dushanbe') ||
      lowerTz.includes('baku') ||
      lowerTz.includes('yerevan') ||
      lowerTz.includes('tbilisi')
    ) {
      return true;
    }
  } catch (e) {
    // Ignore timezone detection errors
  }
  return false;
}

/**
 * Checks whether browser languages indicate CIS preference
 */
function isCISBrowserLanguage() {
  try {
    const langs = (navigator.languages && navigator.languages.length > 0)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || ''];

    for (const l of langs) {
      if (!l) continue;
      const clean = l.toLowerCase().trim();
      for (const prefix of CIS_LANG_PREFIXES) {
        if (clean === prefix || clean.startsWith(`${prefix}-`)) {
          return true;
        }
      }
    }
  } catch (e) {
    // Ignore navigator errors
  }
  return false;
}

/**
 * Determine initial language
 * @returns {'ru' | 'en'}
 */
export function detectInitialLanguage() {
  // 1. Saved choice
  try {
    const saved = localStorage.getItem('handnotes_lang');
    if (saved === 'ru' || saved === 'en') {
      return saved;
    }
  } catch (e) {}

  // 2. URL parameters (?lang=ru, ?lang=en, ?hl=ru)
  try {
    const params = new URLSearchParams(window.location.search);
    const paramLang = (params.get('lang') || params.get('hl'))?.toLowerCase();
    if (paramLang === 'ru') return 'ru';
    if (paramLang === 'en') return 'en';
  } catch (e) {}

  // 3. Browser language check for CIS
  if (isCISBrowserLanguage()) {
    return 'ru';
  }

  // 4. Timezone check for CIS (even if browser is set to English)
  if (isCISTimezone()) {
    return 'ru';
  }

  // 5. Default to English for international users
  return 'en';
}
