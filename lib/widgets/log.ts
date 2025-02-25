/**
 * log.js - log element for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

import util from 'node:util';

const nextTick = global.setImmediate || process.nextTick.bind(process);

import ScrollableText from './scrollabletext';

/**
 * Log
 */

class Log extends ScrollableText {
  constructor(options) {
    options = options || {};

    super(options);

    this.scrollback =
      options.scrollback != null ? options.scrollback : Infinity;
    this.scrollOnInput = options.scrollOnInput;

    this.on('set content', () => {
      if (!this._userScrolled || this.scrollOnInput) {
        nextTick(() => {
          this.setScrollPerc(100);
          this._userScrolled = false;
          this.screen.render();
        });
      }
    });
  }
  type = 'log';
  add() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'object') {
      args[0] = util.inspect(args[0], true, 20, true);
    }
    var text = util.format.apply(util, args);
    this.emit('log', text);
    var ret = this.pushLine(text);
    if (this._clines.fake.length > this.scrollback) {
      this.shiftLine(0, (this.scrollback / 3) | 0);
    }
    return ret;
  }
  log = this.add;
  scroll(offset, always) {
    if (offset === 0) return this._scroll(offset, always);
    this._userScrolled = true;
    var ret = this._scroll(offset, always);
    if (this.getScrollPerc() === 100) {
      this._userScrolled = false;
    }
    return ret;
  }
  _scroll = this.scroll;
}

/**
 * Expose
 */

export default Log;
