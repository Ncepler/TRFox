import { head, put } from "@vercel/blob";
import type { Project } from "@/data/projects";

// Single JSON file in Vercel Blob holds the entire projects array. There's
// only ever one writer (the /toddles admin page), so every write is a full
// overwrite rather than a per-project patch.
const PROJECTS_PATHNAME = "toddles/projects.json";

export async function readProjects(): Promise<Project[]> {
  try {
    const blob = await head(PROJECTS_PATHNAME);
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as Project[]) : [];
  } catch {
    // No blob yet (first run) or a transient read failure: treat as empty.
    return [];
  }
}

// @vercel/blob reads BLOB_READ_WRITE_TOKEN itself and throws a generic,
// easy-to-miss error when it's absent -- every write path (add, edit,
// delete, import, and image upload) checks it here first so they all
// surface the same specific, actionable message instead.
export function assertBlobConfigured(): void {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "Storage isn't connected: no Vercel Blob store is linked to this project (BLOB_READ_WRITE_TOKEN is missing). Add one in the Vercel dashboard under Storage, then redeploy."
    );
  }
}

export async function writeProjects(projects: Project[]): Promise<void> {
  assertBlobConfigured();
  await put(PROJECTS_PATHNAME, JSON.stringify(projects, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}
