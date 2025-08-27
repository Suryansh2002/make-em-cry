export function shuffleArray<T>(arr:Array<T>) {
  const indices: Array<[number, number]> = [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
    indices.push([i, j]);
  }
  return { shuffled: arr, swaps: indices };
}

export function applyShuffle<T>(arr:Array<T>, swaps:Array<[number, number]>) {
  for (let [i, j] of swaps) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
