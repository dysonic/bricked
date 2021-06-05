interface BondExample {
  odd: string;
  even: string;
}

export interface BondPattern {
  start: string;
  repeat: string;
  end: string;
}
export interface Bond {
  id: string;
  label: string;
  example: BondExample;
  pattern: {
    odd: BondPattern;
    even: BondPattern;
  }
}

export const DOUBLE_FLEMISH_BOND: Bond = {
  id: 'double-flemish',
  label: 'Double Flemish',
  example: {
    odd: 'shs',
    even: 'hqsqh',
  },
  pattern: {
    odd: {
      start: 'sh', repeat: 'sh', end: 's',
    },
    even: {
      start: 'hqs', repeat: 'hs', end: 'qh',
    },
  },
};

export const bonds: Array<Bond> = [
  DOUBLE_FLEMISH_BOND,
];
