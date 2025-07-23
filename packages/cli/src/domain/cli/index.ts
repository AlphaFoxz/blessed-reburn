import { Command } from 'commander';
import { createSingletonAgg } from 'vue-fn/domain-server';
import { executeDev, requireDevCommand } from './dev';
import { executeBuild, requireBuildCommand } from './build';
import { reactive, ref } from '@vue/reactivity';
import { DevCommandArgs, SubcommandEnum } from './define';

const agg = createSingletonAgg(() => {
  const isReady = ref(false);
  const currentCommand = ref(SubcommandEnum.None);
  const devCommandArgs = reactive<DevCommandArgs>({ entryPath: 'src/main.ts' });
  const devCommand = requireDevCommand({ currentCommand, devCommandArgs });
  const buildCommand = requireBuildCommand({ currentCommand });

  const program = new Command('vblessed')
    .addCommand(devCommand)
    .addCommand(buildCommand);

  async function init() {
    program.parse(process.argv);
    isReady.value = true;
  }

  return {
    commands: {
      init,
      exec: async () => {
        if (!isReady.value) {
          await init();
        }
        const cmd = currentCommand.value;
        if (cmd === SubcommandEnum.Dev) {
          await executeDev(devCommandArgs);
        } else if (cmd === SubcommandEnum.Build) {
          await executeBuild();
        } else if (cmd === SubcommandEnum.None) {
          return;
        } else {
          isNever(cmd);
        }
      },
    },
  };
});

export function useCliAgg() {
  return agg.api;
}
