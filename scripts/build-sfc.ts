import fs from 'node:fs';
import path from 'node:path';
import {
  parse,
  compileScript,
  compileTemplate,
  type SFCDescriptor,
} from '@vue/compiler-sfc';

const srcDir = 'src';
const outDir = 'dist';

fs.mkdirSync(outDir, { recursive: true });

build();

function build() {
  for (const file of fs.readdirSync(srcDir)) {
    if (!file.endsWith('.vue')) {
      continue;
    }

    const filename = path.join(srcDir, file);
    const { descriptor } = parse(fs.readFileSync(filename, 'utf8'), {
      filename,
    });
    if (!descriptor.template) {
      throw new Error(`No template in ${filename}`);
    }

    const id = file; // 用文件名即可
    // ① Script（含 <script setup>）
    if (descriptor.script || descriptor.scriptSetup) {
      const script = compileScript(descriptor, { id, inlineTemplate: true });
      fs.writeFileSync(
        path.join(outDir, file.replace(/\.vue$/, '.ts')),
        `
${script.content}`, // 已经包含 render，且结尾有 “export default …”
        'utf8',
      );
      continue;
    }

    // ② Template → render 函数
    const tpl = compileTemplate({
      id,
      source: descriptor.template.content,
      filename,
      compilerOptions: {
        // 关键：把默认导入的 'vue' 改成 '@vue/runtime-core'
        runtimeModuleName: '@vue/runtime-core',
        inline: true,
      },
    });
    if (!tpl.ast || !tpl.ast.helpers) {
      throw new Error(`No ast in ${filename}`);
    }

    // ③ 产出 .js 文件
    const code = `import { defineComponent as _defineComponent } from 'vue'
export default _defineComponent({
  setup() {
    return ${tpl.code}
  }
})
  `;
    fs.writeFileSync(
      path.join(outDir, file.replace(/\.vue$/, '.ts')),
      code,
      'utf8',
    );
  }
}
