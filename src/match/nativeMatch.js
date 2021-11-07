/**
 * @param element
 * @param keyword
 */
export default function nativeMatch(element, keyword) {
  if (typeof element === 'string') {
    return keyword.checkString(element);
  } else if (typeof element === 'number') {
    return keyword.checkNumber(element);
  } else {
    return false;
  }
}