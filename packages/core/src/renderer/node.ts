import { genId } from '#core/utilities';

export enum NodeType {
  TEXT = 'text',
  COMMENT = 'comment',
  ELEMENT = 'element',
}

export type OptionalNodeInitialParams = {
  tag?: string;
  children?: TNode[];
  props?: Record<string, any>;
  parentNode?: TNode | null;
  text?: string;
  type: NodeType;
};

export abstract class TNode {
  private readonly id = genId();
  // TODO
  // @ts-ignore
  private tag: string;
  private readonly children: TNode[];
  private readonly props: Record<string, any>;
  private parentNode: TNode | null;
  private text: string;
  private readonly type: NodeType;

  constructor(param: OptionalNodeInitialParams) {
    this.tag = param.tag || '';
    this.children = param.children || [];
    this.props = param.props || [];
    this.parentNode = param.parentNode || null;
    this.text = param.text || '';
    this.type = param.type;
  }
  getChildren(): TNode[] {
    return this.children;
  }
  appendChild(child: TNode): void {
    this.children.push(child);
  }
  getFirstChild(): TNode | null {
    return this.children[0] || null;
  }
  getLastChild(): TNode | null {
    return this.children[this.children.length - 1] || null;
  }
  insertBefore(node: TNode, anchor: TNode | null): void {
    const index = anchor ? this.children.indexOf(anchor) : -1;
    this.children.splice(index, 0, node);
  }
  getParentNode(): TNode | null {
    return this.parentNode;
  }
  protected setParentNode(node: TNode): void {
    this.parentNode = node;
  }
  removeChild(child: TNode): void {
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
  getPreviousSibling(): TNode | null {
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
  getNextSibling(): TNode | null {
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
  equals(node: TNode) {
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
