export enum SubcommandEnum {
  Dev = 'dev',
  Build = 'build',
  None = 'none',
}

export type DevCommandArgs = { entryPath: string };
