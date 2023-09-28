import './assets/main.css'

import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Toast from 'primevue/toast'
import ToastServiceMethods from 'primevue/toastservice'
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css'

import App from './App.vue'
import router from './router'
import { firebaseApp } from '@/data/initializeFirebase'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()]
})
app.use(PrimeVue)
app.use(ToastServiceMethods)

// eslint-disable-next-line vue/multi-word-component-names
app.component('Toast', Toast)

app.mount('#app')
