import { join, normalize } from 'path';
import { I18n } from 'i18n';

// Setup i18n
const i18n = new I18n({
    locales: ['en', 'fr', 'pt'],
    directory: normalize(join(__dirname, '..', 'locales'))
  }),
  locale = Intl.DateTimeFormat().resolvedOptions().locale;

if (locale.includes('pt')) i18n.setLocale('fr');
else if (locale.includes('pt')) i18n.setLocale('pt');
else i18n.setLocale('en');


async function main() {}
