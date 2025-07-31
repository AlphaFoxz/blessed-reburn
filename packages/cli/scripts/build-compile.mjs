#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';
import { builtinModules } from 'node:module';
import esbuild from 'esbuild';

const dirname = import.meta.dirname;

const distDir = path.join(dirname, '..', 'dist');
if (fs.existsSync(distDir) && fs.statSync(distDir).isDirectory()) {
  fs.rmSync(distDir, { recursive: true, force: true });
}

esbuild.build({
  bundle: true,
  entryPoints: [path.join(dirname, '..', 'src', 'index.ts')],
  drop: ['debugger'],
  minify: false,
  outfile: path.join(distDir, 'vbed.mjs'),
  // sourcemap: true,
  loader: {
    //   '.wasm': 'file',
    // '.node': 'file',
  },
  // publicPath: 'pkg',
  format: 'esm',
  // format: 'cjs',
  platform: 'node',
  plugins: [],
  target: 'node18',
  tsconfig: path.join(dirname, '..', 'tsconfig.json'),
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [...builtinModules, 'lightningcss', 'fsevents'],
});
