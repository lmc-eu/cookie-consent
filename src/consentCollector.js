/**
 * Submit information about consent level given by the user.
 *
 * @param {string} consentCollectorApiUrl
 * @param {Object} cookieConsent
 * @param {boolean} acceptedOnlyNecessary
 */
export const submitConsent = (consentCollectorApiUrl, cookieConsent, acceptedOnlyNecessary) => {
  const payload = buildPayload(cookieConsent, acceptedOnlyNecessary);

  postDataToApi(consentCollectorApiUrl, payload);
};

/**
 * @param {Object} cookieConsent
 * @param {boolean} acceptedOnlyNecessary
 * @returns {Object}
 */
const buildPayload = (cookieConsent, acceptedOnlyNecessary) => {
  const cookieData = cookieConsent.get('data');
  const acceptedCategories = cookieConsent.get('level');
  // TODO: read actual categories once following is implemented in vanilla-cookieconsent:
  // https://github.com/orestbida/cookieconsent/discussions/90#discussioncomment-1466886
  const rejectedCategories = acceptedOnlyNecessary
    ? ['ad', 'analytics', 'functionality', 'personalization']
    : [];

  return {
    data: {
      type: 'localDataAcceptationDataEntries',
      attributes: {
        acceptation_id: cookieData.uid,
        accept_type: acceptedOnlyNecessary ? 'accept_necessary' : 'accept_all',
        accepted_categories: acceptedCategories,
        rejected_categories: rejectedCategories,
        revision: cookieConsent.get('revision'),
        source: cookieData.serviceName,
      },
    },
  };
};

/**
 * @param {string} apiUrl
 * @param {Object} payload
 * @return {Promise<any>}
 */
const postDataToApi = async (apiUrl, payload) => {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};

export default submitConsent;