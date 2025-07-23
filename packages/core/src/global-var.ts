import { Node } from '#core/renderer/node';

let screenCount = 0;
let rootNode: Node | null = null;

export function useGlobalVar() {
  return {
    getScreenCount() {
      return screenCount;
    },
    increaseScreenCount() {
      screenCount++;
    },
    setRootNode(node: Node) {
      rootNode = node;
    },
    getRootNode() {
      return rootNode;
    },
  };
}
