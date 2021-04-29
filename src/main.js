import App from './App.svelte';
import router from './router'

import './index.css'

const app = new App({
	target: document.body,
	props: {
    // router
  }
});

window.app = app;

export default app;
