import demo from './demo'
import { createApp } from "vue";

const app = createApp();
// Vue.config.productionTip = false

app.component('VueDocPreview', demo)

app.mount('#app')
