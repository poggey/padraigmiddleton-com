import type { Prediction } from "@/lib/content/schemas";

/** The Ledger's running record as a sentence, never a row of numbers. */
export function recordSentence(predictions: Prediction[]) {
  const made = predictions.length;
  const right = predictions.filter((p) => p.status === "right").length;
  const wrong = predictions.filter((p) => p.status === "wrong").length;
  const open = predictions.filter((p) => p.status === "open").length;
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  if (right + wrong === 0) return `${plural(made, "prediction")} made. None resolved yet.`;
  return `${plural(made, "prediction")} made: ${right} right, ${wrong} wrong, ${open} still open.`;
}
