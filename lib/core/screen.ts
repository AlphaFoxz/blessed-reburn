import { Element } from './renderer/element';
import { NodeType } from './renderer/node';

export class ScreenElement extends Element {
  constructor() {
    super({
      tag: 'screen',
      type: NodeType.ELEMENT,
    });
  }
}
