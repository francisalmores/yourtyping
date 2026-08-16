export function computeStats(spacedWords, partialWord, durationSec) {
  let correct = 0,
    incorrect = 0,
    correctWords = 0,
    totalWords = spacedWords.length;

  spacedWords.forEach((w) => {
    const { target, typed } = w;
    if (typed === target) correctWords++;
    const maxLen = Math.max(target.length, typed.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < target.length && i < typed.length && target[i] === typed[i]) correct++;
      else incorrect++;
    }
    correct++; // the space that ended the word
  });

  if (partialWord && partialWord.typed.length > 0) {
    totalWords++;
    const { target, typed } = partialWord;
    if (typed === target) correctWords++;
    const maxLen = Math.max(target.length, typed.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < target.length && i < typed.length && target[i] === typed[i]) correct++;
      else incorrect++;
    }
  }

  const totalChars = correct + incorrect;
  const minutes = durationSec / 60;
  const netWpm = Math.round(correct / 5 / minutes);
  const rawWpm = Math.round(totalChars / 5 / minutes);
  const accuracy = totalChars > 0 ? Math.round((correct / totalChars) * 100) : 100;

  return {
    duration: durationSec,
    wpm: Math.max(netWpm, 0),
    rawWpm: Math.max(rawWpm, 0),
    accuracy,
    correctChars: correct,
    incorrectChars: incorrect,
    correctWords,
    totalWords,
  };
}
