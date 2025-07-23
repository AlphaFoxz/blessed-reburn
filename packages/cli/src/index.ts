import log from '#cli/utils/log';
import { useCliAgg } from '#cli/domain/cli';
import packageInfo from '#cli/utils/package-info';
import { createTerminalApp } from '#core';

const cliAgg = useCliAgg();
start();

createTerminalApp;

async function start() {
  log.print(
    `Repo Addr:`,
    log.info(packageInfo.repository.url.replace(/git\+/g, ''))
  );
  log.print('');
  log.print(`Script Version:`, log.info(packageInfo.version));
  log.print('');
  log.printDebug('argv:', process.argv);
  log.print('');

  await cliAgg.commands.init();

  await cliAgg.commands.exec();
}
