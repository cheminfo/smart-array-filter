import recursiveMatch from './recursiveMatch';

export default function match(element, criteria, predicate, options) {
  if (criteria.length) {
    let found = false;
    for (let i = 0; i < criteria.length; i++) {
      // match XOR negate
      if (
        recursiveMatch(element, criteria[i], [], options)
          ? !criteria[i].negate
          : criteria[i].negate
      ) {
        if (predicate === 'OR') {
          return true;
        }
        found = true;
      } else if (predicate === 'AND') {
        return false;
      }
    }
    return found;
  }
  return true;
}
