import { join, normalize } from 'path';
import { I18n } from 'i18n';

const i18n = new I18n({
	locales: ['en', 'fr', 'pt'],
	directory: normalize(join(__dirname, '..', 'locales'))
});

async function main() {}
