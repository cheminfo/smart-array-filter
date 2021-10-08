import nativeMatch from './nativeMatch';

export default function recursiveMatch(element, criterium, keys, options) {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      for (let i = 0; i < element.length; i++) {
        if (recursiveMatch(element[i], criterium, keys, options)) {
          return true;
        }
      }
    } else {
      for (let i in element) {
        keys.push(i);
        let didMatch = recursiveMatch(element[i], criterium, keys, options);
        keys.pop();
        if (didMatch) return true;
      }
    }
  } else if (criterium.is) {
    // we check for the presence of a key (jpath)
    if (criterium.is.test(keys.join('.'))) {
      return !!element;
    } else {
      return false;
    }
  } else {
    // need to check if keys match
    const joinedKeys = keys.join('.');
    for (let ignorePath of options.ignorePaths) {
      if (ignorePath.test(joinedKeys)) return false;
    }
    if (criterium.key) {
      const key = options.pathAlias[criterium.key]
        ? options.pathAlias[criterium.key]
        : criterium.key;
      if (!key.test(joinedKeys)) return false;
    }
    return nativeMatch(element, criterium);
  }
}
