/**
 * helpers.js - helpers for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Modules
 */

import fs from 'fs';

import * as unicode from './unicode';

/**
 * Helpers
 */

const helpers = {
  _element: '',
  _screen: '',
  merge(a: Record<string, any>, b: Record<string, any>) {
    Object.keys(b).forEach(function (key) {
      a[key] = b[key];
    });
    return a;
  },
  asort(obj: Array<any>) {
    return obj.sort(function (a, b) {
      a = a.name.toLowerCase();
      b = b.name.toLowerCase();

      if (a[0] === '.' && b[0] === '.') {
        a = a[1];
        b = b[1];
      } else {
        a = a[0];
        b = b[0];
      }

      return a > b ? 1 : a < b ? -1 : 0;
    });
  },
  hsort(obj: Array<any>) {
    return obj.sort(function (a, b) {
      return b.index - a.index;
    });
  },
  findFile(start: string, target: string) {
    const read = function (dir: string): string | null {
      let files: string[] = [];
      var file, stat, out;

      if (
        dir === '/dev' ||
        dir === '/sys' ||
        dir === '/proc' ||
        dir === '/net'
      ) {
        return null;
      }

      try {
        files = fs.readdirSync(dir);
      } catch (e) {
        files = [];
      }

      for (var i = 0; i < files.length; i++) {
        file = files[i];

        if (file === target) {
          return (dir === '/' ? '' : dir) + '/' + file;
        }

        try {
          stat = fs.lstatSync((dir === '/' ? '' : dir) + '/' + file);
        } catch (e) {
          stat = null;
        }

        if (stat && stat.isDirectory() && !stat.isSymbolicLink()) {
          out = read((dir === '/' ? '' : dir) + '/' + file);
          if (out) return out;
        }
      }

      return null;
    };

    return read(start);
  },
  // Escape text for tag-enabled elements.
  escape(text: string) {
    return text.replace(/[{}]/g, function (ch) {
      return ch === '{' ? '{open}' : '{close}';
    });
  },
  parseTags(text: string, screen) {
    return helpers.Element.prototype._parseTags.call(
      { parseTags: true, screen: screen || helpers.Screen.global },
      text,
    );
  },
  generateTags(style: Record<string, string>, text: string) {
    var open = '',
      close = '';

    Object.keys(style || {}).forEach(function (key) {
      var val = style[key];
      if (typeof val === 'string') {
        val = val.replace(/^light(?!-)/, 'light-');
        val = val.replace(/^bright(?!-)/, 'bright-');
        open = '{' + val + '-' + key + '}' + open;
        close += '{/' + val + '-' + key + '}';
      } else {
        if (val === true) {
          open = '{' + key + '}' + open;
          close += '{/' + key + '}';
        }
      }
    });

    if (text != null) {
      return open + text + close;
    }

    return {
      open: open,
      close: close,
    };
  },
  attrToBinary(style: Record<string, string>, element: object) {
    return helpers.Element.prototype.sattr.call(element || {}, style);
  },
  stripTags(text: string) {
    if (!text) return '';
    return text
      .replace(/{(\/?)([\w\-,;!#]*)}/g, '')
      .replace(/\x1b\[[\d;]*m/g, '');
  },
  cleanTags(text: string) {
    return helpers.stripTags(text).trim();
  },
  dropUnicode(text: string) {
    if (!text) return '';
    return text
      .replace(unicode.chars.all, '??')
      .replace(unicode.chars.combining, '')
      .replace(unicode.chars.surrogate, '?');
  },
  get Screen() {
    if (!this._screen) {
      this._screen = require('./widgets/screen'); // TODO
    }
    return this._screen;
  },
  get Element() {
    if (!helpers._element) {
      helpers._element = require('./widgets/element'); // TODO
    }
    return helpers._element;
  },
};

export default helpers;
