import { genId } from '#core/utilities';

export enum NodeType {
  TEXT = 'text',
  COMMENT = 'comment',
  ELEMENT = 'element',
}

export type OptionalNodeInitialParams = {
  tag?: string;
  children?: Node[];
  props?: Record<string, any>;
  parentNode?: Node | null;
  text?: string;
  type: NodeType;
};

export abstract class Node implements Node {
  private id = genId();
  // TODO
  // @ts-ignore
  private tag: string;
  private children: Node[];
  private props: Record<string, any>;
  private parentNode: Node | null;
  private text: string;
  private type: NodeType;

  constructor(param: OptionalNodeInitialParams) {
    this.tag = param.tag || '';
    this.children = param.children || [];
    this.props = param.props || [];
    this.parentNode = param.parentNode || null;
    this.text = param.text || '';
    this.type = param.type;
  }
  getChildren(): Node[] {
    return this.children;
  }
  appendChild(child: Node): void {
    this.children.push(child);
  }
  getFirstChild(): Node | null {
    return this.children[0] || null;
  }
  getLastChild(): Node | null {
    return this.children[this.children.length - 1] || null;
  }
  insertBefore(node: Node, anchor: Node | null): void {
    const index = anchor ? this.children.indexOf(anchor) : -1;
    this.children.splice(index, 0, node);
  }
  getParentNode(): Node | null {
    return this.parentNode;
  }
  protected setParentNode(node: Node): void {
    this.parentNode = node;
  }
  removeChild(child: Node): void {
    const index = this.children.findIndex((c) => c.id === child.id);
    if (index !== undefined) {
      this.children.splice(index, 1);
    }
  }
  getTextContent(): string | undefined {
    if (this.type === NodeType.TEXT || this.type === NodeType.COMMENT) {
      return this.text;
    } else if (this.type === NodeType.ELEMENT) {
      return this.children.map((c) => c.getTextContent()).join('');
    } else {
      isNever(this.type);
    }
  }
  setTextContent(text: string): void {
    while (this.children.length > 0) {
      this.removeChild(this.children[0]);
    }
    this.text = text;
  }
  getText() {
    return this.text;
  }
  setText(text: string) {
    this.text = text;
  }
  getPreviousSibling(): Node | null {
    const parentNode = this.parentNode;
    if (parentNode) {
      const children = parentNode.getChildren();
      const index = children.findIndex((c) => this.equals(c));
      if (index >= 0) {
        return children[index - 1] || null;
      }
    }
    return null;
  }
  getNextSibling(): Node | null {
    const parentNode = this.parentNode;
    if (parentNode) {
      const children = parentNode.getChildren();
      const index = children.findIndex((c) => this.equals(c));
      if (index >= 0) {
        return children[index + 1] || null;
      }
    }
    return null;
  }
  equals(node: Node) {
    return this.id === node.id;
  }
  hashCode() {
    return this.id;
  }
  putProp(key: string, value: any) {
    this.props[key] = value;
  }
  setProps(props: Record<string, any>) {
    for (const key in this.props) {
      delete this.props[key];
    }
    for (const key in props) {
      this.props[key] = props[key];
    }
  }
  getProp(key: string) {
    return this.props[key];
  }
}
