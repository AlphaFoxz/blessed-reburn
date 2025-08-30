import type { Plugin } from 'vite';
import vuePlugin from '@vitejs/plugin-vue';

export interface VBedOptios {}

/**
 * Typesafe alternative to Array.isArray
 * https://github.com/microsoft/TypeScript/pull/48228
 */
export const isArray: (arg: ArrayLike<any> | any) => arg is ReadonlyArray<any> =
  Array.isArray;

function optionAsArray<T>(
  value: T | undefined | null
): Extract<T, readonly any[]> {
  const v = isArray(value)
    ? (value as Extract<T, readonly any[]>)
    : value != null
      ? [value as Exclude<T, readonly any[]>]
      : [];

  // @ts-expect-error: just easier...
  return v;
}

export default function VBed(options: VBedOptios = {}): Plugin<any>[] {
  options;
  return [
    vuePlugin({
      // reactivityTransform: true,
      template: {
        compilerOptions: {
          whitespace: 'condense',
          isNativeTag: (tag) => tag.startsWith('vbed:'),
          // isNativeTag: () => false,
          // getTextMode: node => ???,
          // isCustomElement: (tag) => tag.startsWith('tui:'),
          isVoidTag: (tag) => tag.toLowerCase() === 'hr',

          // nodeTransforms: [
          //   (node, context) => {
          //     console.log('---')
          //     console.log(node)
          //     console.log('---')
          //   },
          // ],
        },
      },
    }) as any,
  ];
}
