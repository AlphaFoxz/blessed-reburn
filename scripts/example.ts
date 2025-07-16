// index.js
import { runApp } from './renderer';
import App from '../dist/App'; // build 后生成的 JS

// 运行根组件
runApp(App);

// 如果组件里用了响应式数据，你还需要手动触发二次渲染：
// 例如
// const state = reactive({ count: 0 });
// setInterval(() => {
//   state.count++;
//   mount(h(App));
// }, 1000);
