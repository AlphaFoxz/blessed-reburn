import tty from 'node:tty';
import fs from 'node:fs';

export type Key = {
  name?: string; // 键的名称，例如 'enter'、'return' 等
  code?: string; // 键的编码，例如 '[M'、'[I'、'[O' 等
  sequence?: string; // 键的序列，例如 '\n'、'\r' 等
  ctrl?: boolean; // 是否按下了 Ctrl 键
  meta?: boolean; // 是否按下了 Meta 键（通常是 Alt 键）
  shift?: boolean; // 是否按下了 Shift 键
  full?: string; // 完整的键名（包括修饰键）
  ch?: string; // 键对应的字符
};

export interface ProgramOptions {
  input?: tty.ReadStream & {
    _blessedInput?: number;
    _keypressHandler?: (...args: any[]) => void;
    _dataHandler?: (...args: any[]) => void;
  };
  output?: tty.WriteStream & {
    _blessedOutput?: number;
    _resizeHandler?: () => void;
    write: (...args: any[]) => void;
  };
  log?: fs.PathLike;
  dump?: fs.PathLike;
  zero?: boolean;
  buffer?: boolean;
  terminal?: string;
  term?: string;
  tput?: boolean;
  debug?: boolean;
  padding?: any;
  extended?: any;
  printf?: any;
  termcap?: any;
  forceUnicode?: boolean;
  resizeTimeout?: number;
}
