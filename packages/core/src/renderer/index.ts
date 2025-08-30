import {
  Component,
  createHydrationRenderer,
  createRenderer,
  type FunctionalComponent,
} from '@vue/runtime-core';

import options from './options';
import { TNode } from './node';
import { TElement } from './element';

// export const renderer = createRenderer<Node, Element>(options);
export const renderer = createHydrationRenderer(options);
