import {
  addSeparators,
  assembleCategoryAd,
  assembleCategoryAnalytics,
  assembleCategoryFunctionality,
  assembleCategoryNecessary,
  assembleCategoryPersonalization,
  assembleDescriptionIntro,
  assembleSecondaryButton,
  isSettingsButtonNotShown,
  legalizeAlmaCareer,
} from '../utils';
import { CookieTableCategories, ExtraMessages, Values, VanillaCookieConsent } from '../types';
import { SecondaryButtonMode } from '../constants';

const extra = {
  and: 'et',
  legalName: 'Alma Career et autres sociétés de son groupe d\'affaire',
};
/**
 * @param {ExtraMessages} [extraMessages] - Object with extra messages
 * @param {SecondaryButtonMode} [secondaryButtonMode] - Which secondary button should be shown
 * @param {CookieTableCategories} [cookieTable] - Cookie table items defined by category
 * @returns {VanillaCookieConsent.Languages} Object with translated messages
 */
export const config = (
  extraMessages: ExtraMessages,
  secondaryButtonMode: Values<typeof SecondaryButtonMode>,
  cookieTable: CookieTableCategories,
): VanillaCookieConsent.Languages => {
  const lang = { ...extra, ...extraMessages };

  return {
    consent_modal: {
      title: lang.consentTitle ?? 'Les cookies rendent notre site encore meilleur',
      description: `
      ${assembleDescriptionIntro(
        "En comprenant mieux ce qui vous intéresse, nous vous proposerons un contenu plus pertinent.",
        lang.descriptionIntro,
      )}
      <p>
        Encliquant le bouton "Tout accepter", vous donnez à
        ${addSeparators(legalizeAlmaCareer(lang.companyNames, lang.legalName), extra.and)}
        votre consentement pour utiliser les cookies de personalisation, d'analytics et de marketing ciblé.
        ${
          isSettingsButtonNotShown(secondaryButtonMode)
            ? `Vous pouvez personaliser l'utilsations des cookies dans vos <strong><a href="" data-cc="c-settings">paramètres personalisés</a></strong>.`
            : ''
        }
      </p>`,
      primary_btn: {
        text: 'Tout accepter',
        role: VanillaCookieConsent.PrimaryButtonRole.ACCEPT_ALL,
      },
      secondary_btn: assembleSecondaryButton(secondaryButtonMode, 'Accepter les nécessaire', 'Personaliser'),
    },
    settings_modal: {
      title: 'Paramètres de cookies personalisés',
      accept_all_btn: 'Tout accepter',
      reject_all_btn: 'Accepter les nécessaire',
      save_settings_btn: 'Enregistrer mes paramètres',
      cookie_table_headers: [{ name: 'Nom' }, { description: 'Description' }, { expiration: 'Expiration' }],
      blocks: [
        {
          description: `Si vous voulez tirer partie du meilleur de notre site web il est préférable d'accepter tous les cookies.
            ${
              lang.settingsModalMoreInfo ??
              `Pour plus d'informations sur ce que sont les cookies et comment nous les utilisons, consultez notre <a href="https://www.almacareer.com/gdpr" target="_blank">Politique en matière de cookies</a>.`
            }`,
        },
        assembleCategoryNecessary(
          'Cookies techinque nécessaire',
          'Ces cookies sont essentiels au bon fonctionnement de notre site Internet et ne peuvent donc pas être désactivés. Sans eux, il ne serait pas possible, par ex. pour afficher tout contenu ou pour vous connecter sur notre site Web.',
          cookieTable,
        ),
        assembleCategoryAnalytics(
          'Cookies d\'analyse',
          'Ceux-ci nous aident à surveiller le nombre de personnes visitant notre site Web et la manière dont elles l\'utilisent. Ces informations nous permettent ensuite d\'améliorer continuellement le site Web et d\'autres services.',
          cookieTable,
        ),
        assembleCategoryFunctionality(
          'Cookies fonctionnels',
          'Notre site Web est encore plus efficace et fonctionne mieux grâce à ces cookies. Par exemple, ils nous permettent d\'utiliser le service de chat et de répondre à vos questions rapidement et facilement.',
          cookieTable,
        ),
        assembleCategoryAd(
          'Cookies de marketing',
          'Ces cookies nous aident à mesurer l\'efficacité de nos publicités et de nos offres de services ciblées. Les cookies marketing nous permettent de vous proposer des informations susceptibles de vous intéresser sur Internet.',
          cookieTable,
        ),
        assembleCategoryPersonalization(
          'Cookies de personalisation',
          'Nos services fonctionnent mieux si nous pouvons les adapter à des utilisateurs spécifiques. En autorisant les cookies de personnalisation, vous augmentez vos chances de trouver le contenu que vous souhaitez.',
          cookieTable,
        ),
      ],
    },
  };
};

export default config;
