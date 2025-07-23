import {
  Component,
  createRenderer,
  type FunctionalComponent,
} from '@vue/runtime-core';

import options from './options';
import { Node } from './node';
import { Element } from './element';

export const renderer = createRenderer<Node, Element>(options);
