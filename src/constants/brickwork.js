export const DOUBLE_FLEMISH_BOND = {
  id: 'double-flemish-bond',
  label: 'Double Flemish bond',
  pattern: {
    odd: 'shs',
    even: 'hqsqh',
  },
  odd: ['S', 'H', 'S', 'H', 'S', 'H', 'S', 'H',  'S', 'H', 'S', 'H',  'S'],
  even: ['H', 'QC', 'S', 'H', 'S', 'H', 'S', 'H',  'S', 'H', 'S', 'H',  'S', 'QC', 'H'],
};

export default [
  DOUBLE_FLEMISH_BOND,
]
