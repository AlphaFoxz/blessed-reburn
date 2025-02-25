/**
 * box.js - box element for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

import Node from './node';
import Element from './element';

/**
 * Box
 */

class Box extends Element {
  constructor(options) {
    options = options || {};
    super(options);
  }
  type = 'box';
}

/**
 * Expose
 */

export default Box;
