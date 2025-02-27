import { Node } from './node';

export type ElementType = 'text' | 'box';
type InferElementProps<TYPE extends ElementType> = TYPE extends 'text'
  ? { '@textContent': string }
  : Record<string, any>;

type ElementMeta<TYPE extends ElementType> = {
  tagName: string;
  readonly attrs: InferElementProps<TYPE>;
};

export class Element<TYPE extends ElementType = 'box'> extends Node {
  protected readonly elementMeta: ElementMeta<TYPE> = {
    tagName: '',
    attrs: {} as InferElementProps<TYPE>,
  };
  constructor() {
    super();
  }
  setTag(tagName: string) {
    if (this.elementMeta.tagName !== '') {
      throw new Error('Tag already set');
    }
    this.elementMeta.tagName = tagName;
  }
}

const elementImpls: Record<string, typeof Element<ElementType>> = {};

export function defineElement<TYPE extends ElementType>(
  tag: TYPE,
  impl: typeof Element<TYPE>,
) {
  elementImpls[tag] = impl;
}

export function createElement(tag: string) {
  if (elementImpls[tag] === undefined) {
    throw new Error(`Unknown element: ${tag}`);
  }
  return new elementImpls[tag]();
}
