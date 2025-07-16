export type ProgramInitOptions = {
  output?: NodeJS.WriteStream;
  terminal?: string;
};

export type AnsiLike = {
  write(data: string): void;
  write(data: string, cb: () => void): any;
};
