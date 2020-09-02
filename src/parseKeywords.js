var separators = /[ ;,\t\r\n]/;

export default function parseKeywords(keywords) {
  var result = [];
  var inQuotes = false;
  var inSeparator = true;
  var currentWord = [];
  var previous = "";
  for (var i = 0; i < keywords.length; i++) {
    var current = keywords.charAt(i);
    if (inQuotes) {
      if (previous === '"') {
        // escaped quote
        if (current === '"') {
          previous = "";
          continue;
        }
        // end of quoted part
        currentWord.pop(); // remove last quote that was added
        inQuotes = false;
        i--;
        continue;
      }
      currentWord.push(current);
      previous = current;
      continue;
    }
    if (inSeparator) {
      // still in separator ?
      if (separators.test(current)) {
        previous = current;
        continue;
      }
      inSeparator = false;
    }
    // start of quoted part
    if (current === '"') {
      inQuotes = true;
      previous = "";
      continue;
    }
    // start of separator part
    if (separators.test(current)) {
      if (currentWord.length) result.push(currentWord.join(""));
      currentWord = [];
      inSeparator = true;
      continue;
    }
    currentWord.push(current);
    previous = "";
  }

  if (previous === '"') currentWord.pop();
  if (currentWord.length) result.push(currentWord.join(""));

  return result;
}
