import { createApp } from 'vue'
import App from './App.vue'
import IndoorMap from './components/IndoorMap.vue'

const app = createApp(App);
app.component('indoor-map', IndoorMap);
app.mount('#app');
