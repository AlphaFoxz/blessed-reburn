import { createRenderer } from '@vue/runtime-core';
import options from './options';
import { Node } from './node';

export type HostElement = {};

export const { render, createApp } = createRenderer<Node, HostElement>(
  options,
);
