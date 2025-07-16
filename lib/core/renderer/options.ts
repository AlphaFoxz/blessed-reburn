import type { RendererOptions } from '@vue/runtime-core';
import { Node } from './node';
import { Element, createElement, createText, createComment } from './element';
import { scheduleFlush } from './render';

const options: RendererOptions<Node, Element> = {
  insert: (child, parent) => {
    parent.appendChild(child);
    console.warn('insert');
    scheduleFlush();
  },
  remove: (child) => {
    const parent = child.getParentNode();
    if (parent) {
      parent.removeChild(child);
    }
    console.warn('remove');
    scheduleFlush();
  },
  createElement: (tag, namespace, is, props): Element => {
    if (props === null) {
      props = undefined;
    }
    namespace;
    is;
    return createElement(tag, props);
  },
  createText: (text) => {
    return createText(text);
  },
  createComment: (text) => {
    return createComment(text);
  },
  setText: (node, text) => {
    node.setText(text);
    console.warn('setText');
    scheduleFlush();
  },
  setElementText: (el, text) => {
    el.setTextContent(text);
    console.warn('setElementText');
    scheduleFlush();
  },
  parentNode: (node) => node.getParentNode(),
  nextSibling: (node) => {
    return node.getNextSibling();
  },
  querySelector: (selector) => {
    throw new Error(`querySelector is not implemented. ${selector}`);
  },
  setScopeId(el, id) {
    el.putProp('scopeId', id);
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    // <parent> before | first ... last | anchor </parent>
    const before = anchor ? anchor.getPreviousSibling() : parent.getLastChild();
    // #5308 can only take cached path if:
    // - has a single root node
    // - nextSibling info is still available
    if (start && (start === end || start.getNextSibling())) {
      // cached
      while (true) {
        parent.insertBefore(start! /* .cloneNode(true) */, anchor);
        if (start === end || !(start = start!.getNextSibling())) {
          break;
        }
      }
    } else {
      // fresh insert
      /* templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === 'svg'
          ? `<svg>${content}</svg>`
          : namespace === 'mathml'
            ? `<math>${content}</math>`
            : content,
      ) as string;

      const template = templateContainer.content;
      if (namespace === 'svg' || namespace === 'mathml') {
        // remove outer svg/math wrapper
        const wrapper = template.firstChild!;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor); */
    }
    content;
    namespace;
    return [
      // first
      before ? before.getNextSibling()! : parent.getFirstChild()!,
      // last
      anchor ? anchor.getPreviousSibling()! : parent.getLastChild()!,
    ];
  },
  patchProp(el, key, prevValue, nextValue, namespace, parentComponent) {
    if (prevValue === nextValue) {
      return;
    }
    namespace;
    parentComponent;
    el.putProp(key, nextValue);
    console.warn('patch');
    scheduleFlush();
  },
};

export default options;
