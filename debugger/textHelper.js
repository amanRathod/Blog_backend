const fs = require('fs');

const readFile = () => {
  debugger;
  let data = fs.readFileSync('sentences.txt');
  let sentences = data.toString();
  return sentences;
};

const getWords = (text) => {
  let allSentences = text.split('\n');
  let flatSentence = allSentences.join(' ');
  let words = flatSentence.split(' ');
  words = words.map((word) => word.trim().toLowerCase());
  return words;
};

const countWords = (words) => {
  let map = {};
  words.forEach((word) => {
    // debugger;
    if (!(word in map)) {
      map[word] = 1;
    } else {
      map[word] += 1;
    }
    // debugger;
  });
  return map;
};


module.exports = { readFile, getWords, countWords };
