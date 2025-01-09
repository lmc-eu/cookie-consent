import 'vanilla-cookieconsent';
import { nanoid } from 'nanoid';
import { mergician } from 'mergician';
import submitConsent from './consentCollector';
import {
  CategoriesChangeset,
  type CookieConsentManager,
  CookieConsentManagerOptions,
  OnConsentCallback,
  OnChangeCallback,
} from './types';
import { CookieConsentCategory, DisplayMode } from './constants';
import { assembleTranslationsConfig } from './languages/loader';
import { pushToDataLayer } from './dataLayer';
import * as CookieConsent from 'vanilla-cookieconsent';
import { AcceptType, CookieConsentConfig, CookieValue } from 'vanilla-cookieconsent';

/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function */
const noopConsentCallback: OnConsentCallback = () => {};
/* eslint-disable-next-line no-unused-vars, @typescript-eslint/no-empty-function */
const noopChangeCallback: OnChangeCallback = () => {};

const defaultOptions: CookieConsentManagerOptions = {
  defaultLang: 'cs',
  autodetectLang: true,
  consentCollectorApiUrl: 'https://consents.almacareer.tech/acl-lda/local-data-acceptation-data-entries',
  onFirstConsent: noopConsentCallback,
  onConsent: noopConsentCallback,
  onChange: noopChangeCallback,
  companyNames: ['Alma Career'],
  displayMode: DisplayMode.FORCE,
  translationOverrides: {},
  cookieTable: {},
  config: {},
};

/**
 * @param {string} serviceName - Identifier of the source service (website/application). Must be provided.
 * @param {CookieConsentManagerOptions} [args] - Options for cookie consent manager
 * @param {string} [args.defaultLang] - Default language. Must be one of predefined languages.
 * @param {boolean} [args.autodetectLang] - Autodetect language from the browser
 * @param {?string} [args.consentCollectorApiUrl] - URL of the API where user consent information should be sent.
 *   Null to disable.
 * @param {OnFirstConsentCallback} [args.onFirstConsent] - Callback to be executed right after any consent is just accepted
 * @param {OnConsentCallback} [args.onConsent] - Callback to be executed when any consent is detected (either given
 *   right now or already saved previously)
 * @param {OnChangeCallback} [args.onChange] - Callback to be executed right after user change his/her preferences
 * @param {Array} [args.companyNames] - Array of strings with company names. Adjust only when the consent needs
 *   to be given to multiple companies.
 * @param {DisplayMode} [args.displayMode] - `force` (default) to show consent in a centered modal box
 *    and to block page until user action. `soft` to show consent in a banner on the bottom of the page.
 * @param {Record<string, TranslationOverride>} [args.translationOverrides] - Translation overrides for specified languages
 * @param {CookieTable} [args.cookieTable] - Cookie table for specified languages
 * @param {CookieConsentConfig} [args.config] - Override default config.
 *   See https://cookieconsent.orestbida.com/reference/configuration-reference.html
 * @returns {CookieConsent} Instance of the underlying CookieConsent component.
 *   See https://cookieconsent.orestbida.com/reference/api-reference.html
 */
const CookieConsentManager: CookieConsentManager = (serviceName, args) => {
  if (!serviceName || serviceName === '' || typeof serviceName !== 'string') {
    throw new Error('serviceName is a required parameter and must be a string');
  }

  const options = { ...defaultOptions, ...args };
  const {
    defaultLang,
    autodetectLang,
    consentCollectorApiUrl,
    onFirstConsent,
    onConsent,
    onChange,
    companyNames,
    displayMode,
    translationOverrides,
    cookieTable,
    config,
  } = options;
  const cookieName = 'almacareer_ccm';
  const cookieConsent = CookieConsent;

  const onFirstConsentHandler = ({ cookie }: { cookie: CookieValue }) => {
    const cookieData = cookieConsent.getCookie('data');
    if (cookieData == null || !('uid' in cookieData)) {
      cookieConsent.setCookieData({
        value: { serviceName, uid: nanoid() },
        mode: 'update',
      });
    }

    pushToDataLayer(cookieConsent.getCookie());

    if (consentCollectorApiUrl !== null) {
      submitConsent(consentCollectorApiUrl, cookieConsent.getCookie(), cookieConsent.getUserPreferences());
    }

    onFirstConsent({ cookieConsent, cookie: cookieConsent.getCookie() });
  };

  const onConsentHandler = ({ cookie }: { cookie: CookieValue }) => {
    onConsent({ cookieConsent, cookie });
  };

  const onChangeHandler = ({
    cookie,
    changedCategories,
    changedServices,
  }: {
    cookie: CookieValue;
    changedCategories: string[];
    changedServices: { [key: string]: string[] };
  }) => {
    const userPreferences = cookieConsent.getUserPreferences();
    const categories: CategoriesChangeset = {
      accepted: userPreferences.acceptedCategories,
      rejected: userPreferences.rejectedCategories,
      changed: changedCategories,
    };

    pushToDataLayer(cookie);

    if (consentCollectorApiUrl !== null) {
      submitConsent(consentCollectorApiUrl, cookie, userPreferences);
    }

    onChange({ cookieConsent, cookie, categories });
  };

  const cookieConsentConfig: CookieConsentConfig = mergician({})(
    {
      autoShow: true, // Show the cookie consent banner as soon as possible
      cookie: {
        name: cookieName, // Predefined cookie name. Do not override.
        expiresAfterDays: (acceptType: AcceptType) => {
          return acceptType === 'necessary' ? 60 : 365; // 2 months or 1 year
        },
      },
      language: {
        default: defaultLang, // Default language used when auto_language is null (or when autodetect failed)
        autoDetect: autodetectLang ? 'document' : undefined, // Autodetect language based on `<html lang="...">` value (with "document" value)
        translations: assembleTranslationsConfig(companyNames, translationOverrides, cookieTable),
      },
      disablePageInteraction: displayMode === DisplayMode.FORCE,
      hideFromBots: true, // To be hidden also from Selenium
      manageScriptTags: true, // Manage third-party scripts loaded using <script>
      guiOptions: {
        consentModal: {
          layout: displayMode === DisplayMode.FORCE ? 'box' : 'bar',
          position: displayMode === DisplayMode.FORCE ? 'middle center' : 'bottom',
          flipButtons: true,
          equalWeightButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          equalWeightButtons: false,
        },
      },
      onConsent: onConsentHandler,
      onFirstConsent: onFirstConsentHandler,
      onChange: onChangeHandler,
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        ad: {},
        analytics: {},
        functionality: {},
        personalization: {},
      },
    },
    config,
  );

  cookieConsent.run(cookieConsentConfig);

  return cookieConsent;
};

export { CookieConsentCategory, DisplayMode, CookieConsent, CookieConsentManager };
