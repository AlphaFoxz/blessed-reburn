import { nanoid } from 'nanoid';

export function genId(size: number = 21) {
  return nanoid(size);
}
