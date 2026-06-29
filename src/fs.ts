import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { ProjectsFile, Snapshot } from "./types.js";

export const ROOT_DIR = process.cwd();

export function fromRoot(...parts: string[]): string {
  return path.join(ROOT_DIR, ...parts);
}

export async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

export async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
  if (!existsSync(filePath)) {
    return null;
  }
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text) as T;
}

export async function writeJson(filePath: string, value: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeText(filePath: string, value: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, value, "utf8");
}

export async function readProjectsData(): Promise<ProjectsFile> {
  const file = fromRoot("data", "projects.json");
  const data = await readJsonIfExists<ProjectsFile>(file);
  if (!data) {
    throw new Error("data/projects.json is missing. Run `npm run update` first.");
  }
  return data;
}

export async function readSnapshots(): Promise<Snapshot[]> {
  const snapshotsDir = fromRoot("data", "snapshots");
  if (!existsSync(snapshotsDir)) {
    return [];
  }
  const files = (await readdir(snapshotsDir))
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();

  const snapshots: Snapshot[] = [];
  for (const file of files) {
    const snapshot = await readJsonIfExists<Snapshot>(path.join(snapshotsDir, file));
    if (snapshot) {
      snapshots.push(snapshot);
    }
  }
  return snapshots;
}
