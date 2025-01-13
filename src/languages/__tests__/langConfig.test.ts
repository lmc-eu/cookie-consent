import { config as configBs } from '../bs';
import { config as configCs } from '../cs';
import { config as configDe } from '../de';
import { config as configEn } from '../en';
import { config as configEt } from '../et';
import { config as configFr } from '../fr';
import { config as configHr } from '../hr';
import { config as configHu } from '../hu';
import { config as configLt } from '../lt';
import { config as configLv } from '../lv';
import { config as configMk } from '../mk';
import { config as configPl } from '../pl';
import { config as configRu } from '../ru';
import { config as configSk } from '../sk';
import { config as configSl } from '../sl';
import { config as configUk } from '../uk';

describe.each([
  ['bs', configBs],
  ['cs', configCs],
  ['de', configDe],
  ['en', configEn],
  ['et', configEt],
  ['fr', configFr],
  ['hr', configHr],
  ['hu', configHu],
  ['lt', configLt],
  ['lv', configLv],
  ['mk', configMk],
  ['pl', configPl],
  ['ru', configRu],
  ['sk', configSk],
  ['sl', configSl],
  ['uk', configUk],
])('config %s', (name, config) => {
  it('should return localization object for acceptNecessary button mode', () => {
    expect(config({ companyNames: ['test1', 'test2', 'test3'] }, {})).toMatchSnapshot();
  });

  it('should return localization object with cookie table', () => {
    const cookieTable = {
      necessary: [
        { name: '_ga*', description: 'Google Analytics description ...', expiration: '1 year' },
        { name: 'foo', description: 'Foo description', expiration: 'end of session' },
      ],
      personalization: [{ name: 'sessionLog_id', description: 'Session log description ...', expiration: '1 year' }],
    };

    expect(config({ companyNames: ['Alma Career'] }, cookieTable)).toMatchSnapshot();
  });
});
