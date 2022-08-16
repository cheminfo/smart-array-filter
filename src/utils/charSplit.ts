/**
 * We split a string into an array of strings except if it in single or double quotes.
 * @param string
 * @param char
 * @returns
 */

export default function charSplit(
  string: string,
  delimiter: string | RegExp,
): string[] {
  const results = [];
  let inQuotes = false;
  let start = 0;
  let quote = '';
  for (let i = 0; i < string.length; i++) {
    const char = string[i];
    if (inQuotes) {
      if (char === quote) {
        inQuotes = false;
        quote = '';
      }
    } else if (char === '"' || char === "'") {
      inQuotes = true;
      quote = char;
    } else if (char.match(delimiter) && !inQuotes) {
      results.push(string.slice(start, i).trim());
      start = i + 1;
    }
    if (i === string.length - 1) {
      results.push(string.slice(start).trim());
    }
  }
  return results
    .map((result) => {
      if (result.startsWith('"') && result.endsWith('"')) {
        return result.slice(1, -1);
      }
      if (result.startsWith("'") && result.endsWith("'")) {
        return result.slice(1, -1);
      }
      return result;
    })
    .filter((result) => result);
}
