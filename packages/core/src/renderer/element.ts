import { Node, NodeType, OptionalNodeInitialParams } from './node';

export class Element extends Node {
  constructor(params: OptionalNodeInitialParams) {
    super(params);
  }
}

export function createElement(
  tag: string,
  props: Record<string, any> = {},
  children: Node[] = [],
) {
  return new Element({ tag, props, children, type: NodeType.ELEMENT });
}

export function createText(text: string) {
  return new Element({ type: NodeType.TEXT, text });
}

export function createComment(text: string) {
  return new Element({ type: NodeType.COMMENT, text });
}
