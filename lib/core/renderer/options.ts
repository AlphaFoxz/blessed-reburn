import type { RendererOptions } from '@vue/runtime-core';
import { Node } from './node';
import { Element, ElementType } from './element';

const options: RendererOptions<Node, Element<ElementType>> = {
  insert: (child, parent) => {
    parent.appendChild(child);
  },
  remove: (child) => {
    const parent = child.getParentNode();
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props): Element => {
    const el = new Element();
    el.setTag(tag);

    if (tag === 'select' && props && props.multiple != null) {
      el.setAttribute('multiple', props.multiple);
    }

    return el;
  },
};

export default options;
