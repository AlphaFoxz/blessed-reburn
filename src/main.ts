// import { EventEmitter } from 'node:events';
import { createTerminalApp } from '../lib/core/renderer';
import App from './App.vue';
import Icon from './Icon.vue';

// const programEventEmitter = new EventEmitter();
// programEventEmitter.on('data', (e: Event) => {
//   console.log('e', e);
// });

createTerminalApp(App);
// app.mount();
