export const operators = {
  '<': (value) => {
    return function (other) {
      return other < value;
    };
  },
  '<=': (value) => {
    return function (other) {
      return other <= value;
    };
  },
  '=': (value) => {
    return function (other) {
      return other === value;
    };
  },
  '>=': (value) => {
    return function (other) {
      return other >= value;
    };
  },
  '>': (value) => {
    return function (other) {
      return other > value;
    };
  },
};

operators['..'] = operators['<='];
