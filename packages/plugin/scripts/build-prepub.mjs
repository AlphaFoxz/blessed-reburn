#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { readPackageSync } from 'read-pkg';

const packageInfo = readPackageSync();
const targetFilePath = path.join(
  import.meta.dirname,
  '..',
  'dist',
  'package.json'
);
delete packageInfo.scripts;
delete packageInfo.devDependencies;
delete packageInfo.private;
packageInfo.name = '@vue-bed/vite-plugin';
packageInfo.main = './index.js';
fs.writeFileSync(targetFilePath, JSON.stringify(packageInfo, null, 2), 'utf-8');
