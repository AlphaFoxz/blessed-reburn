import { EventEmitter } from 'node:events';
import { ProgramInitOptions } from './definition';

export function createProgram(param?: ProgramInitOptions) {
  const output = param?.output || process.stdout;
  const programEventEmitter = new EventEmitter();

  programEventEmitter.on('', () => {});

  return {
    write(...args: Parameters<typeof output.write>) {
      return output.write(...args);
    },
  };
}
