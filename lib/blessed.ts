/**
 * blessed - a high-level terminal interface library for node.js
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */
import * as colors from './colors';
import helpers from './helpers';
import * as unicode from './unicode';
import * as tput from './tput';
import widget from './widget';
import Program from './program';

/**
 * Blessed
 */
class Blessed extends Program {
  static program = Program;
  static Program = Program;
  static tput = tput;
  static Tput = tput;
  static widget = widget;
  static colors = colors;
  static unicode = unicode;
  static helpers = {
    ...helpers,
    sprintf: tput.sprintf,
    tryRead: tput.tryRead,
  };
  constructor(...args: any[]) {
    super(...args);
  }
}

Blessed.helpers.merge(Blessed, Blessed.helpers);
Blessed.helpers.merge(Blessed, Blessed.widget);

/**
 * Expose
 */

export default Blessed;
