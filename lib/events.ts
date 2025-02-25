/**
 * events.mts - event emitter for blessed
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

const slice = Array.prototype.slice;

/**
 * EventEmitter
 */
class EventEmitter {
  private _events: { [key: string]: Function | Function[] } = {};
  private _maxListeners: number | undefined;
  type: string | undefined;
  parent: any;

  setMaxListeners(n: number) {
    this._maxListeners = n;
  }

  addListener(type: string, listener: Function) {
    if (!this._events[type]) {
      this._events[type] = listener;
    } else if (typeof this._events[type] === 'function') {
      this._events[type] = [this._events[type], listener];
    } else {
      this._events[type].push(listener);
    }
    this._emit('newListener', [type, listener]);
  }

  on = this.addListener;

  removeListener(type: string, listener: Function) {
    const handler = this._events[type];
    if (!handler) return;

    if (typeof handler === 'function' || handler.length === 1) {
      delete this._events[type];
      this._emit('removeListener', [type, listener]);
      return;
    }

    for (let i = 0; i < handler.length; i++) {
      if (
        handler[i] === listener ||
        (handler[i] as any).listener === listener
      ) {
        handler.splice(i, 1);
        this._emit('removeListener', [type, listener]);
        return;
      }
    }
  }

  off = this.removeListener;

  removeAllListeners(type?: string) {
    if (type) {
      delete this._events[type];
    } else {
      this._events = {};
    }
  }

  once(type: string, listener: Function) {
    const on = (...args: any[]) => {
      this.removeListener(type, on);
      return listener.apply(this, args);
    };
    on.listener = listener;
    return this.on(type, on);
  }

  listeners(type: string) {
    return typeof this._events[type] === 'function'
      ? [this._events[type]]
      : this._events[type] || [];
  }

  _emit(type: string, args?: any[]) {
    const handler = this._events[type];
    let ret;

    if (!handler) {
      if (type === 'error') {
        throw args[0];
      }
      return;
    }

    if (typeof handler === 'function') {
      return handler.apply(this, args);
    }

    for (let i = 0; i < handler.length; i++) {
      if (handler[i].apply(this, args) === false) {
        ret = false;
      }
    }

    return ret !== false;
  }

  emit(type: string, ...args: any[]) {
    const params = [...arguments];
    const el = this;

    this._emit('event', params);

    if (this.type === 'screen') {
      return this._emit(type, args);
    }

    if (this._emit(type, args) === false) {
      return false;
    }

    const typeWithPrefix = 'element ' + type;
    args.unshift(this);

    do {
      if (!el._events[typeWithPrefix]) continue;
      if (el._emit(typeWithPrefix, args) === false) {
        return false;
      }
    } while (el.parent);

    return true;
  }
}

export { EventEmitter };
export default EventEmitter;
