import { I18n } from '../node_modules/i18n-js/typings/I18n';
import translationFr from '../locales/fr.json';
import translationEn from '../locales/en.json';
import translationPt from '../locales/pt.json';

const i18n = new I18n();
i18n.store(translationEn);
i18n.store(translationFr);
i18n.store(translationPt);

// const locale = Intl.DateTimeFormat().resolvedOptions().locale;
// console.log(locale);

async function main() {}
