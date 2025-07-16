// renderer.js
import { createRenderer, queuePostFlushCb } from '@vue/runtime-core';
import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';

// 节点数据结构——这里只要能 hold children / text 即可
function createElement(type) {
  return { type, children: [], props: {} };
}
function createText(text) {
  return { text };
}

// 把 vnode 树拍平成 ANSI 字符串
function stringify(node, indent = 0) {
  if (!node) {
    return '';
  }
  if (node.text !== undefined) {
    return ' '.repeat(indent) + node.text + '\n';
  }
  return node.children.map((c) => stringify(c, indent + 2)).join('');
}

/* ---------- 刷屏调度 ---------- */
let dirty = false;
const rootRef = createElement('div');
function scheduleFlush() {
  if (dirty) return; // 已经排队
  dirty = true;
  queuePostFlushCb(() => {
    dirty = false;
    // process.stdout.write(ansiEscapes.clearScreen);
    process.stdout.write(chalk.white(stringify(rootRef)));
  });
}

/* ---------- host 节点操作实现 ---------- */
const nodeOps = {
  createElement,
  createText,
  insert(child, parent) {
    parent.children.push(child);
    scheduleFlush();
  },
  remove() {
    scheduleFlush();
  },
  parentNode() {},
  nextSibling() {},
  setText(node, text) {
    node.text = text;
    scheduleFlush();
  },
  setElementText(el, t) {
    el.children = [{ text: t }];
    scheduleFlush();
  },
  patchProp(el, key, prev, next) {
    el.props[key] = next;
    scheduleFlush();
  },
};

const { createApp } = createRenderer(nodeOps);

// 暴露渲染接口
export function runApp(rootComponent) {
  // createApp 内部会把响应式依赖订到 effect 里，自动触发 patch
  const app = createApp(rootComponent).mount(rootRef);
  // scheduleFlush(); // 首帧
  return app;
}
