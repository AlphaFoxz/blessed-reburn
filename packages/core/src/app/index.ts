import { Component } from '@vue/runtime-core';
import type { AnsiLike } from '#core/common';
import { useGlobalVar } from '#core/global-var';
import { createElement } from '#core/renderer/element';
import { renderer } from '#core/renderer';

const rootRef = createElement('screen');
const globalVar = useGlobalVar();
globalVar.setRootNode(rootRef);

export function createTerminalApp(
  rootComponent: Component,
  ansi: AnsiLike = process.stdout
) {
  process.stdin.resume();
  const app = renderer.createApp(rootComponent).mount(rootRef);
  ansi.write('app mounted\n');
  return app;
}
