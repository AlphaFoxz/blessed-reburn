export type TputOptions = {
  terminal?: string;
  term?: string;
  debug?: any;
  padding?: any;
  extended?: boolean;
  printf?: any;
  termcap?: any;
  terminfoPrefix?: any;
  terminfoFile?: any;
  termcapFile?: any;
  stringify?: boolean;
  forceUnicode?: boolean;
};

export type TerminalInfo = {
  header: {
    dataSize: number;
    headerSize: number;
    magicNumber: number;
    namesSize: number;
    boolCount: number;
    numCount: number;
    strCount: number;
    strTableSize: number;
    total: number;
    extended?: ExtendedInfo['header'];
  };
  bools: Record<string, boolean>;
  numbers: Record<string, number>;
  strings: Record<string, number>;
  name: string;
  names: string[];
  desc: string | undefined;
  dir?: string;
  file?: string;
  all?: Record<string, boolean | number>;
  methods?: Record<string, any>;
  features?: {
    unicode: boolean;
    brokenACS: boolean;
    PCRomSet: boolean;
    magicCookie: boolean;
    padding: boolean;
    setbuf: boolean;
    acsc: Record<string, string>;
    acscr: Record<string, string>;
  };
};

export type ExtendedInfo = {
  header: {
    dataSize: number;
    headerSize: number;
    boolCount: number;
    numCount: number;
    strCount: number;
    strTableSize: number;
    lastStrTableOffset: number;
    total: number;
  };
  bools: Record<string, boolean>;
  numbers: Record<string, number>;
  strings: Record<string, number | ''>;
};
