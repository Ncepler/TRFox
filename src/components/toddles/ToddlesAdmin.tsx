"use client";

import { useState, useTransition } from "react";
import type { Project, ProjectImage } from "@/data/projects";
import {
  addProjectAction,
  deleteProjectAction,
  seedProjectsFromSiteAction,
  updateProjectAction,
  uploadImageAction,
  type ProjectInput,
} from "@/app/toddles/actions";
import { ghostButtonClass, primaryButtonClass, secondaryButtonClass } from "@/lib/buttonStyles";

const GROUPS: { value: Project["group"]; label: string }[] = [
  { value: "manhattan", label: "Manhattan" },
  { value: "nassau", label: "Nassau County" },
  { value: "commercial", label: "Commercial and installations" },
];

// Soft corners and real button chrome, not the public site's flat
// underlined links -- see .claude/skills/toddles-dashboard/SKILL.md. The
// button classes themselves live in src/lib/buttonStyles.ts, shared with
// the public Projects section by explicit design decision.
const inputClass =
  "w-full rounded-lg border border-line bg-canvas px-3 py-2 text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

type FormState = {
  id?: string;
  address: string;
  area: string;
  group: Project["group"];
  scope: string;
  sf: string;
  year: string;
  images: ProjectImage[];
};

const emptyForm: FormState = {
  address: "",
  area: "",
  group: "manhattan",
  scope: "",
  sf: "",
  year: "",
  images: [],
};

export default function ToddlesAdmin({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState<FormState>(emptyForm);
  // The form (fields + image picker) starts collapsed behind a single "Add
  // project" button, rather than always open -- an empty form sitting above
  // an empty list read as broken, not as an invitation to fill it in.
  const [formOpen, setFormOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const openForNewProject = () => {
    setError(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setError(null);
    setForm(emptyForm);
  };

  const onSeedFromSite = () => {
    setSeeding(true);
    setSeedMessage(null);
    startTransition(async () => {
      try {
        const result = await seedProjectsFromSiteAction();
        if (!result.ok) {
          setSeedMessage(`Import failed: ${result.message}`);
          return;
        }
        setProjects(result.projects);
        setSeedMessage(
          result.added > 0
            ? `Added ${result.added} project${result.added === 1 ? "" : "s"} from the site.`
            : "Already up to date -- nothing new to add.",
        );
      } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        setSeedMessage(`Import failed: ${detail}`);
      } finally {
        setSeeding(false);
      }
    });
  };

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: ProjectImage[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadImageAction(fd);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        uploaded.push({ url: result.url, caption: "" });
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const updateCaption = (index: number, caption: string) => {
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => (i === index ? { ...img, caption } : img)),
    }));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    setForm((f) => {
      const target = index + dir;
      if (target < 0 || target >= f.images.length) return f;
      const next = [...f.images];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...f, images: next };
    });
  };

  const removeImage = (index: number) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const editProject = (project: Project) => {
    setError(null);
    setForm({
      id: project.id,
      address: project.address,
      area: project.area,
      group: project.group,
      scope: project.scope,
      sf: project.sf ? String(project.sf) : "",
      year: project.year ? String(project.year) : "",
      images: project.images ?? [],
    });
    setFormOpen(true);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const input: ProjectInput = {
      address: form.address.trim(),
      area: form.area.trim(),
      group: form.group,
      scope: form.scope.trim(),
      sf: form.sf ? Number(form.sf) : undefined,
      year: form.year ? Number(form.year) : undefined,
      images: form.images,
    };
    const id = form.id;
    startTransition(async () => {
      const result = id
        ? await updateProjectAction({ id, ...input })
        : await addProjectAction(input);
      // A generic "Save failed." hid the real cause (e.g. no Blob store
      // connected) -- the action returns its own message instead of
      // throwing, since Next.js redacts thrown Server Action errors down
      // to an opaque digest in production.
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setProjects(result.projects);
      closeForm();
    });
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const onDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteProjectAction(id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setProjects(result.projects);
      if (form.id === id) closeForm();
    });
  };

  const confirmDeleteProject = confirmDeleteId ? projects.find((p) => p.id === confirmDeleteId) : undefined;

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-medium tracking-[-0.03em]">Projects</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSeedFromSite}
            disabled={seeding || isPending}
            className={secondaryButtonClass}
          >
            {seeding ? "Importing…" : "Import from site"}
          </button>
          {!formOpen ? (
            <button type="button" onClick={openForNewProject} className={primaryButtonClass}>
              Add project
            </button>
          ) : null}
        </div>
      </div>
      {seedMessage ? <p className="mt-2 text-sm text-ink-soft">{seedMessage}</p> : null}

      {/* The panel's own height animates via the grid-rows 0fr/1fr trick
          instead of max-height, so it settles at exactly the form's real
          height with no measurement or magic number, and reduced motion
          collapses straight to instant per the accessibility rule this
          dashboard follows. */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          formOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-6 rounded-2xl border border-line bg-canvas p-6 shadow-sm">
            <h3 className="font-display text-lg font-medium tracking-[-0.02em]">
              {form.id ? "Edit project" : "New project"}
            </h3>
            <form onSubmit={onSubmit} className="mt-6 grid max-w-2xl gap-6">
              <label className="flex flex-col gap-2">
                <span className="font-display text-sm text-ink-soft">Address</span>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-display text-sm text-ink-soft">Area</span>
                <input
                  type="text"
                  required
                  value={form.area}
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-display text-sm text-ink-soft">Group</span>
                <select
                  value={form.group}
                  onChange={(e) => setForm((f) => ({ ...f, group: e.target.value as Project["group"] }))}
                  className={inputClass}
                >
                  {GROUPS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-display text-sm text-ink-soft">Scope</span>
                <textarea
                  value={form.scope}
                  onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                  className={inputClass}
                  rows={3}
                />
              </label>
              <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="font-display text-sm text-ink-soft">Square feet</span>
                  <input
                    type="number"
                    value={form.sf}
                    onChange={(e) => setForm((f) => ({ ...f, sf: e.target.value }))}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-display text-sm text-ink-soft">Year</span>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-display text-sm text-ink-soft">Images</span>
                {/* A bare <input type="file"> renders as unstyled system text
                    ("Choose Files" / "No file chosen") that doesn't read as
                    clickable. The input itself can't be restyled directly, so
                    it's visually hidden and a real button-styled label
                    triggers it instead. */}
                <label
                  aria-disabled={uploading}
                  className={`${secondaryButtonClass} w-fit cursor-pointer aria-disabled:cursor-not-allowed`}
                >
                  {uploading ? "Uploading…" : "Choose images"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={(e) => onFilesSelected(e.target.files)}
                    className="sr-only"
                  />
                </label>
                {form.images.length > 0 && (
                  <ul className="mt-2 space-y-3">
                    {form.images.map((img, i) => (
                      <li
                        key={img.url}
                        className="flex items-center gap-3 rounded-xl border border-line p-2"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        <input
                          type="text"
                          placeholder="Caption"
                          value={img.caption}
                          onChange={(e) => updateCaption(i, e.target.value)}
                          className={`${inputClass} flex-1`}
                        />
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(i, -1)}
                            disabled={i === 0}
                            className={ghostButtonClass}
                            aria-label="Move image up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(i, 1)}
                            disabled={i === form.images.length - 1}
                            className={ghostButtonClass}
                            aria-label="Move image down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className={ghostButtonClass}
                            style={{ color: "var(--color-accent)" }}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {form.images[0] ? <p className="text-xs text-ink-soft">First image is the hero.</p> : null}
              </div>

              {error ? (
                <p className="text-sm" style={{ color: "var(--color-accent)" }}>
                  {error}
                </p>
              ) : null}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className={primaryButtonClass}
                >
                  {form.id ? "Save changes" : "Add project"}
                </button>
                <button type="button" onClick={closeForm} className={secondaryButtonClass}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.id} className="rounded-2xl border border-line p-4 shadow-sm">
            {project.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.images[0].url} alt="" className="h-40 w-full rounded-lg object-cover" />
            ) : null}
            <p className="mt-3 font-display font-medium">{project.address}</p>
            <p className="text-sm text-ink-soft">
              {project.area} · {project.group}
              {project.sf ? ` · ${project.sf} sf` : ""}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => editProject(project)}
                className={ghostButtonClass}
                style={{ color: "var(--color-accent)" }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteId(project.id)}
                className={ghostButtonClass}
                style={{ color: "#B3261E" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 ? <p className="text-ink-soft">No projects yet.</p> : null}
      </div>

      {confirmDeleteProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Delete ${confirmDeleteProject.address}?`}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(25,23,20,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDeleteId(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setConfirmDeleteId(null);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl border border-line bg-canvas p-6 shadow-sm">
            <p className="font-display text-lg font-medium">Delete this project?</p>
            <p className="mt-2 text-sm text-ink-soft">
              {confirmDeleteProject.address} will be permanently removed. This can&apos;t be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(confirmDeleteProject.id);
                  setConfirmDeleteId(null);
                }}
                className={`${primaryButtonClass} !bg-[#B3261E]`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
