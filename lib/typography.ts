// Keeps number ranges such as 2027–28 on one line by adding word joiners around the en dash.
export function keepRangesTogether(text: string) {
  return text.replace(/(\d)–(\d)/g, "$1⁠–⁠$2");
}
