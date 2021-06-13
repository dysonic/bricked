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

export const STRETCHER_BOND: Bond = {
  id: 'stretcher',
  label: 'Stretcher',
  example: {
    odd: 'SHS',
    even: 'HSH',
  },
  pattern: {
    odd: {
      start: 'S', repeat: 'S', end: 'S',
    },
    even: {
      start: 'HS', repeat: 'S', end: 'H',
    },
  },
};

export const FLEMISH_BOND: Bond = {
  id: 'flemish',
  label: 'Flemish',
  example: {
    odd: 'SHS',
    even: 'HQSQH',
  },
  pattern: {
    odd: {
      start: 'SH', repeat: 'SH', end: 'S',
    },
    even: {
      start: 'HQS', repeat: 'HS', end: 'QH',
    },
  },
};

export const bonds: Array<Bond> = [
  STRETCHER_BOND,
  FLEMISH_BOND,
];
