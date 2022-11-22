import { createI18n } from 'vue-i18n'
import messages from './lang'

const i18n = createI18n({
	legacy: false,
	locale: 'zh',
	messages
})

export default i18n