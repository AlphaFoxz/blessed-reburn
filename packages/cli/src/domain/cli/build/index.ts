import { Ref } from '@vue/reactivity';
import { Command } from 'commander';
import { SubcommandEnum } from '../define';

export async function executeBuild() {}

export function requireBuildCommand(params: { currentCommand: Ref<SubcommandEnum> }) {
  return new Command().name('build').action(() => {
    params.currentCommand.value = SubcommandEnum.Build;
  });
}
