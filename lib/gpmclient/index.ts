/**
 * gpmclient.js - support the gpm mouse protocol
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

import net, { Socket } from 'node:net';
import fs from 'node:fs';
import { EventEmitter } from '../events';
import { Gpm_Connect } from './define';

const GPM_USE_MAGIC = false;

const GPM_MOVE = 1,
  GPM_DRAG = 2,
  GPM_DOWN = 4,
  GPM_UP = 8;

const GPM_DOUBLE = 32,
  GPM_MFLAG = 128;

const GPM_REQ_NOPASTE = 3,
  GPM_HARD = 256;

const GPM_MAGIC = 0x47706d4c;
const GPM_SOCKET = '/dev/gpmctl';

// typedef struct Gpm_Connect {
//   unsigned short eventMask, defaultMask;
//   unsigned short minMod, maxMod;
//   int pid;
//   int vc;
// } Gpm_Connect;

function send_config(
  socket: Socket,
  gpmConnect: Gpm_Connect,
  callback: Function,
) {
  var buffer: Buffer;
  if (GPM_USE_MAGIC) {
    buffer = Buffer.alloc(20);
    buffer.writeUInt32LE(GPM_MAGIC, 0);
    buffer.writeUInt16LE(gpmConnect.eventMask, 4);
    buffer.writeUInt16LE(gpmConnect.defaultMask, 6);
    buffer.writeUInt16LE(gpmConnect.minMod, 8);
    buffer.writeUInt16LE(gpmConnect.maxMod, 10);
    buffer.writeInt16LE(process.pid, 12);
    buffer.writeInt16LE(gpmConnect.vc, 16);
  } else {
    buffer = Buffer.alloc(16);
    buffer.writeUInt16LE(gpmConnect.eventMask, 0);
    buffer.writeUInt16LE(gpmConnect.defaultMask, 2);
    buffer.writeUInt16LE(gpmConnect.minMod, 4);
    buffer.writeUInt16LE(gpmConnect.maxMod, 6);
    buffer.writeInt16LE(gpmConnect.pid, 8);
    buffer.writeInt16LE(gpmConnect.vc, 12);
  }
  socket.write(buffer, function () {
    if (callback) callback();
  });
}

// typedef struct Gpm_Event {
//   unsigned char buttons, modifiers;  // try to be a multiple of 4
//   unsigned short vc;
//   short dx, dy, x, y; // displacement x,y for this event, and absolute x,y
//   enum Gpm_Etype type;
//   // clicks e.g. double click are determined by time-based processing
//   int clicks;
//   enum Gpm_Margin margin;
//   // wdx/y: displacement of wheels in this event. Absolute values are not
//   // required, because wheel movement is typically used for scrolling
//   // or selecting fields, not for cursor positioning. The application
//   // can determine when the end of file or form is reached, and not
//   // go any further.
//   // A single mouse will use wdy, "vertical scroll" wheel.
//   short wdx, wdy;
// } Gpm_Event;

function parseEvent(raw: Buffer) {
  return {
    buttons: raw[0],
    modifiers: raw[1],
    vc: raw.readUInt16LE(2),
    dx: raw.readInt16LE(4),
    dy: raw.readInt16LE(6),
    x: raw.readInt16LE(8),
    y: raw.readInt16LE(10),
    type: raw.readInt16LE(12),
    clicks: raw.readInt32LE(16),
    margin: raw.readInt32LE(20),
    wdx: raw.readInt16LE(24),
    wdy: raw.readInt16LE(26),
  };
}

export class GpmClient extends EventEmitter {
  gpm?: Socket;
  constructor(_options?: {}) {
    super();

    const pid = process.pid;

    // check tty for /dev/tty[n]
    let path: string = '';
    try {
      path = fs.readlinkSync('/proc/' + pid + '/fd/0');
    } catch (e) {}
    let tty: string | RegExpExecArray | null = /tty[0-9]+$/.exec(path);
    if (tty === null) {
      // TODO: should  also check for /dev/input/..
    }

    var vc: number | null = null;
    if (tty) {
      tty = tty[0];
      vc = +/[0-9]+$/.exec(tty)![0];
    }

    var self = this;

    if (tty) {
      fs.stat(GPM_SOCKET, function (err, stat) {
        if (err || !stat.isSocket()) {
          return;
        }

        var conf = {
          eventMask: 0xffff,
          defaultMask: GPM_MOVE | GPM_HARD,
          minMod: 0,
          maxMod: 0xffff,
          pid,
          vc: vc!,
        };

        var gpm = net.createConnection(GPM_SOCKET);
        this.gpm = gpm;

        gpm.on('connect', function () {
          send_config(gpm, conf, function () {
            conf.pid = 0;
            conf.vc = GPM_REQ_NOPASTE;
            //send_config(gpm, conf);
          });
        });

        gpm.on('data', function (packet) {
          var evnt = parseEvent(packet);
          switch (evnt.type & 15) {
            case GPM_MOVE:
              if (evnt.dx || evnt.dy) {
                (self as unknown as EventEmitter).emit(
                  'move',
                  evnt.buttons,
                  evnt.modifiers,
                  evnt.x,
                  evnt.y,
                );
              }
              if (evnt.wdx || evnt.wdy) {
                (self as unknown as EventEmitter).emit(
                  'mousewheel',
                  evnt.buttons,
                  evnt.modifiers,
                  evnt.x,
                  evnt.y,
                  evnt.wdx,
                  evnt.wdy,
                );
              }
              break;
            case GPM_DRAG:
              if (evnt.dx || evnt.dy) {
                (self as unknown as EventEmitter).emit(
                  'drag',
                  evnt.buttons,
                  evnt.modifiers,
                  evnt.x,
                  evnt.y,
                );
              }
              if (evnt.wdx || evnt.wdy) {
                (self as unknown as EventEmitter).emit(
                  'mousewheel',
                  evnt.buttons,
                  evnt.modifiers,
                  evnt.x,
                  evnt.y,
                  evnt.wdx,
                  evnt.wdy,
                );
              }
              break;
            case GPM_DOWN:
              (self as unknown as EventEmitter).emit(
                'btndown',
                evnt.buttons,
                evnt.modifiers,
                evnt.x,
                evnt.y,
              );
              if (evnt.type & GPM_DOUBLE) {
                (self as unknown as EventEmitter).emit(
                  'dblclick',
                  evnt.buttons,
                  evnt.modifiers,
                  evnt.x,
                  evnt.y,
                );
              }
              break;
            case GPM_UP:
              (self as unknown as EventEmitter).emit(
                'btnup',
                evnt.buttons,
                evnt.modifiers,
                evnt.x,
                evnt.y,
              );
              if (!(evnt.type & GPM_MFLAG)) {
                (self as unknown as EventEmitter).emit(
                  'click',
                  evnt.buttons,
                  evnt.modifiers,
                  evnt.x,
                  evnt.y,
                );
              }
              break;
          }
        });

        gpm.on('error', function () {
          self.stop();
        });
      });
    }
  }
  init1 = (function () {
    Object.setPrototypeOf(GpmClient.prototype, EventEmitter.prototype);
  })();
  stop() {
    if (this.gpm) {
      this.gpm.end();
    }
    delete this.gpm;
  }
  ButtonName(btn: number) {
    if (btn & 4) return 'left';
    if (btn & 2) return 'middle';
    if (btn & 1) return 'right';
    return '';
  }
  hasShiftKey(mod: number) {
    return mod & 1 ? true : false;
  }
  hasCtrlKey(mod: number) {
    return mod & 4 ? true : false;
  }
  hasMetaKey(mod: number) {
    return mod & 8 ? true : false;
  }
}

export default GpmClient;
