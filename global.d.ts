export {};

declare global {
  function isNever(...v: never[]): void;

  declare namespace NodeJS {
    interface ProcessEnv {
      TERM: string;
    }
  }
}
