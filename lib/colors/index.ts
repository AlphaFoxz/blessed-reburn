/**
 * colors.js - color-related functions for blessed.
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

import { Blend, isRgbArray, RgbArray } from './define';

function hex(n: number): string {
  let s = n.toString(16);
  if (s.length < 2) {
    s = '0' + n;
  }
  return s;
}

export function match(hex: string): number;
export function match([r, g, b]: RgbArray): number;
export function match(r: number, g: number, b: number): number;
export function match(
  p1: number | RgbArray | string,
  p2?: number,
  p3?: number,
): number {
  let r1: number = -1;
  let g1: number = -1;
  let b1: number = -1;
  if (typeof p1 === 'string') {
    if (p1[0] !== '#') {
      return -1;
    }
    const hex = hexToRGB(p1);
    r1 = hex[0];
    g1 = hex[1];
    b1 = hex[2];
  } else if (isRgbArray(p1)) {
    r1 = p1[0];
    g1 = p1[1];
    b1 = p1[2];
  } else if (typeof p1 === 'number') {
    g1 = p2!;
    b1 = p3!;
  } else {
    isNever(p1);
  }

  const hash = (r1 << 16) | (g1 << 8) | b1;

  if (_cache[hash] != null) {
    return _cache[hash];
  }

  var ldiff = Infinity,
    li = -1,
    i = 0,
    c,
    r2,
    g2,
    b2,
    diff;

  for (; i < vcolors.length; i++) {
    c = vcolors[i];
    r2 = c[0];
    g2 = c[1];
    b2 = c[2];

    diff = colorDistance([r1, g1, b1], [r2, g2, b2]);

    if (diff === 0) {
      li = i;
      break;
    }

    if (diff < ldiff) {
      ldiff = diff;
      li = i;
    }
  }

  return (_cache[hash] = li);
}

export function RGBToHex(r: number, g: number, b: number): string {
  if (Array.isArray(r)) {
    (b = r[2]), (g = r[1]), (r = r[0]);
  }

  return '#' + hex(r) + hex(g) + hex(b);
}

export function hexToRGB(hex: string): RgbArray {
  if (hex.length === 4) {
    hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  var col = parseInt(hex.substring(1), 16),
    r = (col >> 16) & 0xff,
    g = (col >> 8) & 0xff,
    b = col & 0xff;

  return [r, g, b];
}

// As it happens, comparing how similar two colors are is really hard. Here is
// one of the simplest solutions, which doesn't require conversion to another
// color space, posted on stackoverflow[1]. Maybe someone better at math can
// propose a superior solution.
// [1] http://stackoverflow.com/questions/1633828

function colorDistance(color1: RgbArray, color2: RgbArray) {
  return (
    Math.pow(30 * (color1[0] - color2[0]), 2) +
    Math.pow(59 * (color1[1] - color2[1]), 2) +
    Math.pow(11 * (color2[2] - color2[2]), 2)
  );
}

// This might work well enough for a terminal's colors: treat RGB as XYZ in a
// 3-dimensional space and go midway between the two points.
export function mixColors(c1: number, c2: number, alpha?: number) {
  // if (c1 === 0x1ff) return c1;
  // if (c2 === 0x1ff) return c1;
  if (c1 === 0x1ff) c1 = 0;
  if (c2 === 0x1ff) c2 = 0;
  if (alpha == null) alpha = 0.5;

  const colorArr1 = vcolors[c1];
  let r1 = colorArr1[0];
  let g1 = colorArr1[1];
  let b1 = colorArr1[2];

  const colorArr2 = vcolors[c2];
  const r2 = colorArr2[0];
  const g2 = colorArr2[1];
  const b2 = colorArr2[2];

  r1 += ((r2 - r1) * alpha) | 0;
  g1 += ((g2 - g1) * alpha) | 0;
  b1 += ((b2 - b1) * alpha) | 0;

  return match([r1, g1, b1]);
}

export const blend: Blend = (
  attr: number,
  attr2: number | null,
  alpha?: number,
) => {
  var name, i, c, nc;

  var bg = attr & 0x1ff;
  if (attr2 != null) {
    var bg2 = attr2 & 0x1ff;
    if (bg === 0x1ff) bg = 0;
    if (bg2 === 0x1ff) bg2 = 0;
    bg = mixColors(bg, bg2, alpha);
  } else {
    if (blend._cache[bg] != null) {
      bg = blend._cache[bg];
      // } else if (bg < 8) {
      //   bg += 8;
    } else if (bg >= 8 && bg <= 15) {
      bg -= 8;
    } else {
      name = ncolors[bg];
      if (name) {
        for (i = 0; i < ncolors.length; i++) {
          if (name === ncolors[i] && i !== bg) {
            c = vcolors[bg];
            nc = vcolors[i];
            if (nc[0] + nc[1] + nc[2] < c[0] + c[1] + c[2]) {
              blend._cache[bg] = i;
              bg = i;
              break;
            }
          }
        }
      }
    }
  }

  attr &= ~0x1ff;
  attr |= bg;

  let fg = (attr >> 9) & 0x1ff;
  if (attr2 != null) {
    let fg2 = (attr2 >> 9) & 0x1ff;
    // 0, 7, 188, 231, 251
    if (fg === 0x1ff) {
      // XXX workaround
      fg = 248;
    } else {
      if (fg === 0x1ff) fg = 7;
      if (fg2 === 0x1ff) fg2 = 7;
      fg = mixColors(fg, fg2, alpha);
    }
  } else {
    if (blend._cache[fg] != null) {
      fg = blend._cache[fg];
      // } else if (fg < 8) {
      //   fg += 8;
    } else if (fg >= 8 && fg <= 15) {
      fg -= 8;
    } else {
      name = ncolors[fg];
      if (name) {
        for (i = 0; i < ncolors.length; i++) {
          if (name === ncolors[i] && i !== fg) {
            c = vcolors[fg];
            nc = vcolors[i];
            if (nc[0] + nc[1] + nc[2] < c[0] + c[1] + c[2]) {
              blend._cache[fg] = i;
              fg = i;
              break;
            }
          }
        }
      }
    }
  }

  attr &= ~(0x1ff << 9);
  attr |= fg << 9;

  return attr;
};

blend._cache = {};

export const _cache: number[] = [];

export function reduce(color: number, total: number) {
  if (color >= 16 && total <= 16) {
    color = (ccolors as any)[color];
  } else if (color >= 8 && total <= 8) {
    color -= 8;
  } else if (color >= 2 && total <= 2) {
    color %= 2;
  }
  return color;
}

// XTerm Colors
// These were actually tough to track down. The xterm source only uses color
// keywords. The X11 source needed to be examined to find the actual values.
// They then had to be mapped to rgb values and then converted to hex values.
export const xterm = Object.freeze([
  '#000000', // black
  '#cd0000', // red3
  '#00cd00', // green3
  '#cdcd00', // yellow3
  '#0000ee', // blue2
  '#cd00cd', // magenta3
  '#00cdcd', // cyan3
  '#e5e5e5', // gray90
  '#7f7f7f', // gray50
  '#ff0000', // red
  '#00ff00', // green
  '#ffff00', // yellow
  '#5c5cff', // rgb:5c/5c/ff
  '#ff00ff', // magenta
  '#00ffff', // cyan
  '#ffffff', // white
] as const);

// Seed all 256 colors. Assume xterm defaults.
// Ported from the xterm color generation script.
let vcolors: RgbArray[] = [];
let colors = (function () {
  const result: string[] = [];
  var cols = result,
    _cols = vcolors,
    r,
    g,
    b,
    i,
    l;

  function push(i: number, r: number, g: number, b: number) {
    cols[i] = '#' + hex(r) + hex(g) + hex(b);
    _cols[i] = [r, g, b];
  }

  // 0 - 15
  xterm.forEach(function (c, i) {
    const n = parseInt(c.substring(1), 16) as number;
    push(i, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff);
  });

  // 16 - 231
  for (r = 0; r < 6; r++) {
    for (g = 0; g < 6; g++) {
      for (b = 0; b < 6; b++) {
        i = 16 + r * 36 + g * 6 + b;
        push(i, r ? r * 40 + 55 : 0, g ? g * 40 + 55 : 0, b ? b * 40 + 55 : 0);
      }
    }
  }

  // 232 - 255 are grey.
  for (g = 0; g < 24; g++) {
    l = g * 10 + 8;
    i = 232 + g;
    push(i, l, l, l);
  }

  return cols;
})();

// Map higher colors to the first 8 colors.
// This allows translation of high colors to low colors on 8-color terminals.
// FIXME why thiere's dumplicated exporting ?
let ccolors: number[] | Record<string, (number | [number, number])[] | number> =
  (function () {
    var _cols = vcolors.slice(),
      cols = colors.slice(),
      out: number[];

    vcolors = vcolors.slice(0, 8);
    colors = colors.slice(0, 8);

    out = cols.map(match);

    colors = cols;
    vcolors = _cols;

    return out;
  })();

export { colors, vcolors };

export const colorNames = Object.freeze({
  // special
  default: -1,
  normal: -1,
  bg: -1,
  fg: -1,
  // normal
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
  // light
  lightblack: 8,
  lightred: 9,
  lightgreen: 10,
  lightyellow: 11,
  lightblue: 12,
  lightmagenta: 13,
  lightcyan: 14,
  lightwhite: 15,
  // bright
  brightblack: 8,
  brightred: 9,
  brightgreen: 10,
  brightyellow: 11,
  brightblue: 12,
  brightmagenta: 13,
  brightcyan: 14,
  brightwhite: 15,
  // alternate spellings
  grey: 8,
  gray: 8,
  lightgrey: 7,
  lightgray: 7,
  brightgrey: 7,
  brightgray: 7,
});

export function convert(
  color: number | string | RgbArray | undefined | Function,
) {
  if (typeof color === 'number') {
  } else if (typeof color === 'string') {
    const k = color.replace(/[\- ]/g, '') as keyof typeof colorNames;
    if (colorNames[k] != null) {
      color = colorNames[k];
    } else {
      color = match(color);
    }
  } else if (Array.isArray(color)) {
    color = match(color);
  } else {
    color = -1;
  }
  return color !== -1 ? color : 0x1ff;
}

// Map higher colors to the first 8 colors.
// This allows translation of high colors to low colors on 8-color terminals.
// Why the hell did I do this by hand?
ccolors = {
  blue: [
    4,
    12,
    [17, 21],
    [24, 27],
    [31, 33],
    [38, 39],
    45,
    [54, 57],
    [60, 63],
    [67, 69],
    [74, 75],
    81,
    [91, 93],
    [97, 99],
    [103, 105],
    [110, 111],
    117,
    [128, 129],
    [134, 135],
    [140, 141],
    [146, 147],
    153,
    165,
    171,
    177,
    183,
    189,
  ],

  green: [
    2,
    10,
    22,
    [28, 29],
    [34, 36],
    [40, 43],
    [46, 50],
    [64, 65],
    [70, 72],
    [76, 79],
    [82, 86],
    [106, 108],
    [112, 115],
    [118, 122],
    [148, 151],
    [154, 158],
    [190, 194],
  ],

  cyan: [
    6, 14, 23, 30, 37, 44, 51, 66, 73, 80, 87, 109, 116, 123, 152, 159, 195,
  ],

  red: [
    1,
    9,
    52,
    [88, 89],
    [94, 95],
    [124, 126],
    [130, 132],
    [136, 138],
    [160, 163],
    [166, 169],
    [172, 175],
    [178, 181],
    [196, 200],
    [202, 206],
    [208, 212],
    [214, 218],
    [220, 224],
  ],

  magenta: [
    5, 13, 53, 90, 96, 127, 133, 139, 164, 170, 176, 182, 201, 207, 213, 219,
    225,
  ],

  yellow: [3, 11, 58, [100, 101], [142, 144], [184, 187], [226, 230]],

  black: [0, 8, 16, 59, 102, [232, 243]],

  white: [7, 15, 145, 188, 231, [244, 255]],
};
export { ccolors };

const ncolors: string[] = [];

Object.keys(ccolors).forEach(function (name) {
  const target = ccolors as Record<string, (number | [number, number])[]>;
  target[name].forEach(function (offset) {
    const k = name as keyof typeof colorNames;
    if (typeof offset === 'number') {
      ncolors[offset] = name;
      target[offset] = colorNames[k] as any;
      return;
    }
    for (var i = offset[0], l = offset[1]; i <= l; i++) {
      ncolors[i] = name;
      target[i] = colorNames[k] as any;
    }
  });
  delete target[name];
});
export { ncolors };
