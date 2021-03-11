import { createApp } from 'vue'
import App from './App.vue'

import "primeflex/primeflex.css";
import "primevue/resources/themes/saga-blue/theme.css";
// import "primevue/resources/themes/vela-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import PrimeVue from "primevue/config";
import IndoorMap from './components/IndoorMap.vue'
import Sidebar from "primevue/sidebar";
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup";
import BadgeDirective from "primevue/badgedirective";
import InputText from "primevue/inputtext";
import Dialog from 'primevue/dialog';
import RadioButton from 'primevue/radiobutton';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Chart from 'primevue/chart';
import OverlayPanel from "primevue/overlaypanel";
import Dropdown from 'primevue/dropdown';
import Listbox from 'primevue/listbox';
import MultiSelect from 'primevue/multiselect';
import router from './router'

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(router);
app.component('indoor-map', IndoorMap);
app.component("Sidebar", Sidebar);
app.component("Button", Button);
app.component("InputText", InputText);
app.directive("badge", BadgeDirective);
app.component("Dialog",Dialog);
app.component("Avatar", Avatar);
app.component("AvatarGroup", AvatarGroup);
app.component("RadioButton", RadioButton);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Toast", Toast);
app.component("Chart", Chart);
app.component("OverlayPanel", OverlayPanel);
app.component("Dropdown",Dropdown);
app.component("Listbox",Listbox);
app.component("MultiSelect", MultiSelect);
app.mount('#app');
