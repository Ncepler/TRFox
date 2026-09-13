"use server";

import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import type { Project, ProjectImage } from "@/data/projects";
import { projects as siteProjects } from "@/data/projects";
import { readProjects, writeProjects } from "@/lib/blob";
import { isAuthed, setAuthed } from "@/lib/toddlesAuth";

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!process.env.TODDLES_ADMIN_PASSWORD || password !== process.env.TODDLES_ADMIN_PASSWORD) {
    redirect("/toddles?error=1");
  }
  await setAuthed();
  redirect("/toddles");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nextId(area: string, existing: Project[]): string {
  const base = slugify(area) || "project";
  const ids = new Set(existing.map((p) => p.id));
  if (!ids.has(base)) return base;
  let n = 2;
  while (ids.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

async function requireAuthed(): Promise<void> {
  if (!(await isAuthed())) {
    throw new Error("Not authorized");
  }
}

export async function uploadImageAction(formData: FormData): Promise<string> {
  await requireAuthed();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");
  const blob = await put(`toddles/images/${Date.now()}-${file.name}`, file, {
    access: "public",
  });
  return blob.url;
}

export type ProjectInput = {
  address: string;
  area: string;
  group: Project["group"];
  scope: string;
  sf?: number;
  year?: number;
  images: ProjectImage[];
};

export async function addProjectAction(input: ProjectInput): Promise<Project[]> {
  await requireAuthed();
  const projects = await readProjects();
  const project: Project = { id: nextId(input.area, projects), ...input };
  const updated = [...projects, project];
  await writeProjects(updated);
  return updated;
}

export async function updateProjectAction(project: Project): Promise<Project[]> {
  await requireAuthed();
  const projects = await readProjects();
  const updated = projects.map((p) => (p.id === project.id ? project : p));
  await writeProjects(updated);
  return updated;
}

export async function deleteProjectAction(id: string): Promise<Project[]> {
  await requireAuthed();
  const projects = await readProjects();
  const updated = projects.filter((p) => p.id !== id);
  await writeProjects(updated);
  return updated;
}

// One-click bootstrap: the site originally shipped with a hardcoded project
// list (src/data/projects.ts). Before this admin existed, that hardcoded
// list *was* "the projects on the website." This copies any of those that
// aren't already in the blob store over, so Toddles starts out matching
// what's already live. Safe to click more than once -- it only ever adds
// entries whose id isn't already present, never overwrites or duplicates.
//
// Errors are caught and returned (rather than thrown) because Next.js
// redacts thrown Server Action errors down to an opaque digest in
// production -- this is the only way the real cause reaches the browser.
export type SeedResult =
  | { ok: true; projects: Project[]; added: number }
  | { ok: false; message: string };

export async function seedProjectsFromSiteAction(): Promise<SeedResult> {
  try {
    await requireAuthed();
    const existing = await readProjects();
    const existingIds = new Set(existing.map((p) => p.id));
    const missing = siteProjects.filter((p) => !existingIds.has(p.id));
    const updated = [...existing, ...missing];
    if (missing.length > 0) {
      await writeProjects(updated);
    }
    return { ok: true, projects: updated, added: missing.length };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}
