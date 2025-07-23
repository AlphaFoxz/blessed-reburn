#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { readPackageSync } from 'read-pkg'

const packageInfo = readPackageSync()
const targetFilePath = path.join(
  import.meta.dirname,
  '..',
  'src',
  'utils',
  'package-info.ts'
)
if (!fs.existsSync(targetFilePath)) {
  throw new Error(`${targetFilePath} not found`)
} else if (!fs.statSync(targetFilePath).isFile()) {
  throw new Error(`${targetFilePath} is not a file`)
}
delete packageInfo.scripts
delete packageInfo.devDependencies
delete packageInfo.private
packageInfo.name = '@vue-bed/cli'
fs.writeFileSync(
  targetFilePath,
  `export default ${JSON.stringify(packageInfo, null, 2)}`,
  'utf-8'
)
