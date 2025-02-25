export type RgbArray = [r: number, g: number, b: number];
export function isRgbArray(arg: any): arg is RgbArray {
  return (
    Array.isArray(arg) &&
    arg.length === 3 &&
    typeof arg[0] === 'number' &&
    typeof arg[1] === 'number' &&
    typeof arg[2] === 'number'
  );
}

export type Blend = {
  (attr: number, attr2: number | null, alpha: number): number;
  _cache: Record<number, any>;
};
