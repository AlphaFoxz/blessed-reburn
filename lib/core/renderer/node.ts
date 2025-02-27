import { genId } from '../utilities';

export type NodeMeta = {
  readonly id: string;
  readonly children: Node[];
  parentNode: Node | null;
};

export abstract class Node {
  protected nodeMeta: NodeMeta = {
    id: genId(),
    children: [],
    parentNode: null,
  };
  appendChild(child: Node): void {
    this.nodeMeta.children.push(child);
  }
  getParentNode(): Node | null {
    return this.nodeMeta.parentNode;
  }
  protected setParentNode(node: Node): void {
    this.nodeMeta.parentNode = node;
  }
  removeChild(child: Node): void {
    const index = this.nodeMeta.children.findIndex(
      (c) => c.nodeMeta.id === child.nodeMeta.id,
    );
    if (index !== undefined) {
      this.nodeMeta.children.splice(index, 1);
    }
  }
}
