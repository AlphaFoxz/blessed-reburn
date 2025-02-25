/**
 * keys.mts - emit key presses
 * Copyright (c) 2010-2015, Joyent, Inc. and other contributors (MIT License)
 * https://github.com/chjj/blessed
 */

// Originally taken from the node.js tree:
// Copyright Joyent, Inc. and other Node contributors. All rights reserved.
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

import { EventEmitter } from 'events';
type CustomEventEmitter = EventEmitter & { _keypressDecoder?: StringDecoder };
import { StringDecoder } from 'string_decoder';

/**
 * Accepts a readable Stream instance and makes it emit "keypress" events
 */
function emitKeypressEvents(stream: CustomEventEmitter) {
  if (stream._keypressDecoder) return;
  stream._keypressDecoder = new StringDecoder('utf8');

  function onData(b: string | Buffer) {
    if (stream.listenerCount('keypress') > 0) {
      const decoder = new StringDecoder('utf8');
      const r = decoder.write(b);
      if (r) {
        stream.emit('keypress', r);
      }
    } else {
      // Nobody's watching anyway
      stream.removeListener('data', onData);
      stream.on('newListener', onNewListener);
    }
  }

  function onNewListener(event: string) {
    if (event === 'keypress') {
      stream.on('data', onData);
      stream.removeListener('newListener', onNewListener);
    }
  }

  if (stream.listenerCount('keypress') > 0) {
    stream.on('data', onData);
  } else {
    stream.on('newListener', onNewListener);
  }
}
export { emitKeypressEvents };

// Regex patterns for ANSI escape code splitting
const metaKeyCodeReAnywhere = /(?:\x1b)([a-zA-Z0-9])/;
const metaKeyCodeRe = new RegExp('^' + metaKeyCodeReAnywhere.source + '$');
const functionKeyCodeReAnywhere = new RegExp(
  '(?:\x1b+)(O|N|\[|\[\[)(?:' +
    [
      '(\d+)(?:(;\d+)?)([~^$])',
      '(?:M([@ #!a`])(.)(.))', // mouse
      '(?:1;)?(\d+)?([a-zA-Z])',
    ].join('|') +
    ')',
);
const functionKeyCodeRe = new RegExp('^' + functionKeyCodeReAnywhere.source);

const escapeCodeReAnywhere = new RegExp(
  [
    functionKeyCodeReAnywhere.source,
    metaKeyCodeReAnywhere.source,
    /\x1b./.source,
  ].join('|'),
);

function emitKeys(stream: EventEmitter, s: string | Buffer) {
  if (Buffer.isBuffer(s)) {
    s = s.toString(/* stream.encoding ||  */ 'utf-8');
  }

  if (isMouse(s)) return;

  let buffer: string[] = [];
  let match;
  while ((match = escapeCodeReAnywhere.exec(s))) {
    buffer = buffer.concat(s.slice(0, match.index).split(''));
    buffer.push(match[0]);
    s = s.slice(match.index + match[0].length);
  }
  buffer = buffer.concat(s.split(''));

  buffer.forEach(function (s) {
    let key:
        | undefined
        | {
            sequence: string;
            name?: string;
            ctrl: boolean;
            meta: boolean;
            shift: boolean;
            code?: string;
          } = {
        sequence: s,
        name: undefined,
        ctrl: false,
        meta: false,
        shift: false,
        code: undefined,
      },
      parts: RegExpExecArray | null;

    // Code to determine the key name based on the sequence
    if (s === '\r') key.name = 'return';
    else if (s === '\n') key.name = 'enter';
    else if (s === '\t') key.name = 'tab';
    else if (s === '\b' || s === '\x7f' || s === '\x1b\x7f' || s === '\x1b\b')
      key.name = 'backspace';
    else if (s === '\x1b' || s === '\x1b\x1b') key.name = 'escape';
    else if (s === ' ' || s === '\x1b ') key.name = 'space';
    else if (s.length === 1 && s <= '\x1a') {
      key.name = String.fromCharCode(s.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
      key.ctrl = true;
    } else if (s.length === 1 && s >= 'a' && s <= 'z') key.name = s;
    else if (s.length === 1 && s >= 'A' && s <= 'Z') {
      key.name = s.toLowerCase();
      key.shift = true;
    } else if ((parts = metaKeyCodeRe.exec(s))) {
      key.name = parts[1].toLowerCase();
      key.meta = true;
      key.shift = /^[A-Z]$/.test(parts[1]);
    } else if ((parts = functionKeyCodeRe.exec(s))) {
      const code =
        (parts[1] || '') +
        (parts[2] || '') +
        (parts[4] || '') +
        (parts[9] || '');
      const modifier = parseInt(parts[3] || parts[8] || '1') - 1;

      key.ctrl = !!(modifier & 4);
      key.meta = !!(modifier & 10);
      key.shift = !!(modifier & 1);
      key.code = code;

      switch (code) {
        case 'OP':
          key.name = 'f1';
          break;
        case 'OQ':
          key.name = 'f2';
          break;
        case 'OR':
          key.name = 'f3';
          break;
        case 'OS':
          key.name = 'f4';
          break;
        case '[11~':
          key.name = 'f1';
          break;
        case '[12~':
          key.name = 'f2';
          break;
        case '[13~':
          key.name = 'f3';
          break;
        case '[14~':
          key.name = 'f4';
          break;
        case '[[A':
          key.name = 'f1';
          break;
        case '[[B':
          key.name = 'f2';
          break;
        case '[[C':
          key.name = 'f3';
          break;
        case '[[D':
          key.name = 'f4';
          break;
        case '[[E':
          key.name = 'f5';
          break;
        case '[15~':
          key.name = 'f5';
          break;
        // Other cases...
        default:
          key.name = 'undefined';
          break;
      }
    }

    if (key.name === undefined) {
      key = undefined;
    }

    stream.emit('keypress', s.length === 1 ? s : undefined, key);
  });
}

function isMouse(s: string) {
  return (
    /\x1b\[M/.test(s) ||
    /\x1b\[M([\x00\u0020-\uffff]{3})/.test(s) ||
    /\x1b\[(\d+;\d+;\d+)M/.test(s)
  );
}
