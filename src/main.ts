import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

console.log('111111111');
createApp(App).use(store).use(router).mount('#app');
