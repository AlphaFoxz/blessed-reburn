import { TNode, NodeType, OptionalNodeInitialParams } from './node';

export class TElement extends TNode {
  constructor(params: OptionalNodeInitialParams) {
    super(params);
  }
}

export function createElement(
  tag: string,
  props: Record<string, any> = {},
  children: TNode[] = []
) {
  return new TElement({ tag, props, children, type: NodeType.ELEMENT });
}

export function createText(text: string) {
  return new TElement({ type: NodeType.TEXT, text });
}

export function createComment(text: string) {
  return new TElement({ type: NodeType.COMMENT, text });
}
