// FridgeCam Live — the worst app idea ever pitched, in one sentence.
// The program writes the line to entry.txt and enforces the competition
// gate itself before writing anything.
import { mkdirSync, writeFileSync } from "node:fs";
import * as path from "node:path";

const LINE =
  "FridgeCam Live is a $10-a-month app that livestreams the inside of your fridge to your phone, so you can watch your leftovers age in real time from the comfort of your couch.";

const MAX_CHARS = 240;

// Self-gate: the entry must be exactly one non-blank sentence of 1-240
// code points, ending in a single period. Enforced here so the program
// fails loudly instead of writing a line the competition would refuse.
function validateEntry(line: string): number {
  const count = [...line].length;
  if (count < 1 || count > MAX_CHARS) {
    throw new Error(`entry is ${count} characters, must be 1-${MAX_CHARS}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // One sentence: exactly one period, the sentence terminator at the end.
  if ((line.match(/\./g) ?? []).length !== 1 || !line.endsWith(".")) {
    throw new Error("entry must be exactly one sentence");
  }
  return count;
}

const charCount = validateEntry(LINE);

// Resolve where the entry goes. The grader runs the program with
// $MAKEFUN_OUTPUT_DIR set to its writable output directory and reads the
// entry from there, so that wins; $OUTPUT_PATH is a second explicit
// override; a local output/ next to this file is the fallback for runs
// on a dev machine.
function resolveOutputPath(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return path.join(fromEnv, "entry.txt");
  }
  const legacy = process.env.OUTPUT_PATH;
  if (legacy !== undefined && legacy.trim() !== "") {
    return legacy;
  }
  return path.join(process.cwd(), "output", "entry.txt");
}

const outPath = resolveOutputPath();
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE, "utf8");
console.log(`wrote ${charCount} characters to ${outPath}`);
