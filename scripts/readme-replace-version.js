const replace = require('replace-in-file');
const packageJson = require('../package.json');
const options = {
  files: 'README.md',
  from: /cookie-consent-manager@([0-9]\.[0-9]\.[0-9])/gm,
  to: `cookie-consent-manager@${packageJson.version}`,
};

replace(options)
  .then((results) => {
    console.log('Replacement results:', results);
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
