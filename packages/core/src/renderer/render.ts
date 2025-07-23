import { queuePostFlushCb } from '@vue/runtime-core';
import chalk from 'chalk';
// import ansiEscapes from 'ansi-escapes';
import { Node } from './node';
import { useGlobalVar } from '#core/global-var';

const globalVar = useGlobalVar();

function stringify(node: Node, indent = 0): string {
  if (!node) {
    return '';
  }
  if (node.getTextContent() !== undefined) {
    return ' '.repeat(indent) + node.getTextContent() + '\n';
  }
  return node
    .getChildren()
    .map((c) => stringify(c, indent + 2))
    .join('');
}

let isDirty = false;
export function scheduleFlush() {
  console.warn('try flush');
  if (isDirty) {
    return;
  } // 已经排队
  isDirty = true;
  queuePostFlushCb(() => {
    isDirty = false;
    console.warn('scheduleFlush');
    const rootNode = globalVar.getRootNode();
    if (!rootNode) {
      throw new Error('rootNode is null');
    }
    // process.stdout.write(ansiEscapes.clearScreen);
    process.stdout.write(chalk.green(stringify(rootNode)));
  });
}
