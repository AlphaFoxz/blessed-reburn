import { createProgram } from '../lib/core/program';

const program = createProgram();

setTimeout(() => {
  program.exit();
}, 3000);
