import { createServer } from 'vite';
import { ViteNodeRunner } from 'vite-node/client';
import { ViteNodeServer } from 'vite-node/server';
import { resolve } from 'node:path';
import { startHMRServer } from './websocket';
import { Command } from 'commander';
import { Reactive, Ref } from '@vue/reactivity';
import { DevCommandArgs, SubcommandEnum } from '../define';

interface HotCallback {
  // the dependencies must be fetchable paths
  deps: string[];
  fn: (modules: object[]) => void;
}
interface HotModule {
  id: string;
  callbacks: HotCallback[];
}
class InvalidateSignal extends Error {
  constructor() {
    super();
  }
}

const hotModulesMap = new Map<string, HotModule>();
const dataMap = new Map<string, any>();
const pruneMap = new Map<string, (data: any) => void | Promise<void>>();

function createHotContext(ownerPath: string) {
  const fullPath = resolve('.' + ownerPath);

  if (!dataMap.has(fullPath)) {
    dataMap.set(fullPath, {});
  }

  // when a file is hot updated, a new context is created
  // clear its stale callbacks
  const mod = hotModulesMap.get(fullPath);
  if (mod) {
    mod.callbacks = [];
  }

  function acceptDeps(deps: string[], callback: HotCallback['fn'] = () => {}) {
    // console.debug('accept dep', deps)
    const mod = hotModulesMap.get(fullPath) || {
      id: ownerPath,
      callbacks: [],
    };
    mod.callbacks.push({
      deps,
      fn: callback,
    });
    hotModulesMap.set(fullPath, mod);
  }

  return {
    get data() {
      return dataMap.get(fullPath);
    },
    accept(deps: any, callback?: any) {
      if (typeof deps === 'function' || !deps) {
        // self-accept: hot.accept(() => {})
        acceptDeps([ownerPath], ([mod]) => deps && deps(mod));
      } else if (typeof deps === 'string') {
        // explicit deps
        acceptDeps([deps], ([mod]) => callback && callback(mod));
      } else if (Array.isArray(deps)) {
        acceptDeps(deps, callback);
      } else {
        throw new Error(`invalid hot.accept() usage.`);
      }
    },
    prune(cb: (data: any) => void) {
      // TODO: do we need this?
      debugger;
      pruneMap.set(ownerPath, cb);
    },

    invalidate(...args: any[]) {
      // TODO: is this called?
      console.error('invalidate', ...args);
    },
  };
}

export async function executeDev(devCommandArgs: DevCommandArgs) {
  const viteServer = await createServer({
    clearScreen: false,
    optimizeDeps: {
      noDiscovery: true,
      include: [],
    },
  });

  await viteServer.pluginContainer.buildStart({});

  const nodeServer = new ViteNodeServer(viteServer, {
    deps: {
      fallbackCJS: true,
    },
  });

  const nodeRunner = new ViteNodeRunner({
    root: viteServer.config.root,
    base: viteServer.config.base,
    fetchModule(id) {
      return nodeServer.fetchModule(id);
    },
    resolveId(id, importer) {
      return nodeServer.resolveId(id, importer);
    },
    requestStubs: {
      '/@vite/client': {
        injectQuery: (id: string) => id,
        createHotContext: (id: string) => createHotContext(id),
        updateStyle() {},
      },
    },
  });

  const passedPort = Number(process.env.PORT);
  const { port } = await startHMRServer(viteServer, passedPort || null);
  // Pass on the port that is being used to the main app
  process.env.PORT = String(port);

  const entryPointId = `/${devCommandArgs.entryPath}`;
  const entryPoint = resolve('.' + entryPointId);

  viteServer.watcher.on('change', async (fullPath: string) => {
    const existingModule = hotModulesMap.get(fullPath);

    // full reload, tell the app to stop
    if (fullPath === entryPoint) {
      // throw new InvalidateSignal()
    }

    // console.error('changed file', fullPath, existingModule)

    if (existingModule) {
      const resolved = await nodeServer.resolveId(existingModule.id);
      // const resolved = await nodeRunner.resolveUrl(existingModule.id, fullPath);
      const newModule = await nodeRunner.executeId(resolved.id);
      existingModule.callbacks.forEach((cb) => cb.fn([newModule]));
    }
  });

  // provide the vite define variable in this context
  await nodeRunner.executeId('/@vite/env');
  // TODO: executeId() to get full control over the App (reload, show error)
  // should probably be added by vue-termui plugin

  async function loadApp() {
    try {
      await nodeRunner.executeId(entryPointId);
    } catch (err) {
      // TODO: full reload signal
      if (err instanceof InvalidateSignal) {
        setTimeout(loadApp, 0);
      } else {
        // TODO: make the app display an error box
        console.error(err);
      }
    }
  }

  await loadApp();
}

export function requireDevCommand(params: {
  currentCommand: Ref<SubcommandEnum>;
  devCommandArgs: DevCommandArgs;
}) {
  return new Command()
    .name('dev')
    .option('entryPath <entryPath>', 'entry path to run dev server')
    .action((options) => {
      if (options.entryPath) {
        params.devCommandArgs.entryPath = options.entryPath;
      }
      params.currentCommand.value = SubcommandEnum.Dev;
    });
}
