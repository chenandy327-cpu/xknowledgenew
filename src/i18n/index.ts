import zhCN from './zh-CN';

type Locale = typeof zhCN;

let currentLocale: Locale = zhCN;

export const useTranslations = () => {
  return currentLocale;
};

export const t = (key: string): string => {
  const keys = key.split('.');
  let result: any = currentLocale;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // Return the key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : key;
};

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export default {
  useTranslations,
  t,
  setLocale
};