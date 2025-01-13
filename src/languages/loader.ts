import { config as configBs } from './bs';
import { config as configCs } from './cs';
import { config as configDe } from './de';
import { config as configEn } from './en';
import { config as configEt } from './et';
import { config as configFr } from './fr';
import { config as configHr } from './hr';
import { config as configHu } from './hu';
import { config as configLt } from './lt';
import { config as configLv } from './lv';
import { config as configMk } from './mk';
import { config as configPl } from './pl';
import { config as configRu } from './ru';
import { config as configSk } from './sk';
import { config as configSl } from './sl';
import { config as configUk } from './uk';
import { CookieTable, TranslationOverride } from '../types';
import { Translation } from 'vanilla-cookieconsent';

const languagesMap = {
  bs: configBs,
  cs: configCs,
  de: configDe,
  en: configEn,
  et: configEt,
  fr: configFr,
  hr: configHr,
  hu: configHu,
  lt: configLt,
  lv: configLv,
  mk: configMk,
  pl: configPl,
  ru: configRu,
  sk: configSk,
  sl: configSl,
  uk: configUk,
};

/* eslint-disable no-param-reassign */
export const assembleTranslationsConfig = (
  companyNames: string[],
  translationOverrides: Record<string, TranslationOverride>,
  cookieTable: CookieTable,
): Record<string, Translation> =>
  Object.entries(languagesMap).reduce(
    (languagesConfig, [code, configFunction]) => {
      languagesConfig[code] = configFunction({ companyNames, ...translationOverrides[code] }, cookieTable[code] || {});

      return languagesConfig;
    },
    {} as Record<string, Translation>,
  );
/* eslint-enable no-param-reassign */
