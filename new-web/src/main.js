import { createApp } from 'vue'
import App from './App.vue'

import "primeflex/primeflex.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import IndoorMap from './components/IndoorMap.vue'
import Sidebar from "primevue/sidebar";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import BadgeDirective from "primevue/badgedirective";

const app = createApp(App);
app.use(PrimeVue, { ripple: true });

app.component('indoor-map', IndoorMap);
app.component("Sidebar", Sidebar);
app.component("Button", Button);
app.directive("badge", BadgeDirective);

app.component("Avatar", Avatar);
app.component("AvatarGroup", AvatarGroup);
app.mount('#app');
