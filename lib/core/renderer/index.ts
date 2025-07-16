import { Component, createRenderer } from '@vue/runtime-core';
import type { AnsiLike } from '../../common';
import options from './options';
import { Node } from './node';
import { createElement, Element } from './element';
import { useGlobalVar } from '../global-var';

const { createApp } = createRenderer<Node, Element>(options);
const rootRef = createElement('screen');
const globalVar = useGlobalVar();
globalVar.setRootNode(rootRef);

export function createTerminalApp(
  rootComponent: Component,
  ansi: AnsiLike = process.stdout,
) {
  process.stdin.resume();
  const app = createApp(rootComponent).mount(rootRef);
  ansi.write('app mounted\n');
  return app;
}
