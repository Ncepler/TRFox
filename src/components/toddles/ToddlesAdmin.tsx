"use client";

import { useState, useTransition } from "react";
import type { Project, ProjectImage } from "@/data/projects";
import {
  addProjectAction,
  deleteProjectAction,
  updateProjectAction,
  uploadImageAction,
  type ProjectInput,
} from "@/app/toddles/actions";

const GROUPS: { value: Project["group"]; label: string }[] = [
  { value: "manhattan", label: "Manhattan" },
  { value: "nassau", label: "Nassau County" },
  { value: "commercial", label: "Commercial and installations" },
];

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
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => setForm(emptyForm);

  const onFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: ProjectImage[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const url = await uploadImageAction(fd);
        uploaded.push({ url, caption: "" });
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
      try {
        const updated = id
          ? await updateProjectAction({ id, ...input })
          : await addProjectAction(input);
        setProjects(updated);
        resetForm();
      } catch {
        setError("Save failed.");
      }
    });
  };

  const onDelete = (id: string) => {
    startTransition(async () => {
      try {
        const updated = await deleteProjectAction(id);
        setProjects(updated);
        if (form.id === id) resetForm();
      } catch {
        setError("Delete failed.");
      }
    });
  };

  return (
    <div className="mt-12 space-y-16">
      <section>
        <h2 className="font-display text-2xl font-medium tracking-[-0.03em]">
          {form.id ? "Edit project" : "Add project"}
        </h2>
        <form onSubmit={onSubmit} className="mt-6 grid max-w-2xl gap-6">
          <label className="flex flex-col gap-2">
            <span className="font-display text-sm text-ink-soft">Address</span>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              className="border border-line bg-canvas px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-display text-sm text-ink-soft">Area</span>
            <input
              type="text"
              required
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              className="border border-line bg-canvas px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-display text-sm text-ink-soft">Group</span>
            <select
              value={form.group}
              onChange={(e) => setForm((f) => ({ ...f, group: e.target.value as Project["group"] }))}
              className="border border-line bg-canvas px-3 py-2"
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
              className="border border-line bg-canvas px-3 py-2"
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
                className="border border-line bg-canvas px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-display text-sm text-ink-soft">Year</span>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className="border border-line bg-canvas px-3 py-2"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-display text-sm text-ink-soft">Images</span>
            <input type="file" accept="image/*" multiple disabled={uploading} onChange={(e) => onFilesSelected(e.target.files)} />
            {uploading ? <p className="text-sm text-ink-soft">Uploading&hellip;</p> : null}
            {form.images.length > 0 && (
              <ul className="mt-2 space-y-3">
                {form.images.map((img, i) => (
                  <li key={img.url} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="h-16 w-16 object-cover" />
                    <input
                      type="text"
                      placeholder="Caption"
                      value={img.caption}
                      onChange={(e) => updateCaption(i, e.target.value)}
                      className="flex-1 border border-line bg-canvas px-3 py-2"
                    />
                    <div className="flex gap-1">
                      <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="tap-target px-2 disabled:opacity-30">
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === form.images.length - 1}
                        className="tap-target px-2 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="tap-target px-2 text-sm"
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

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending || uploading}
              className="tap-target self-start border-b border-accent font-display text-sm disabled:opacity-50"
              style={{ color: "var(--color-accent)" }}
            >
              {form.id ? "Save changes" : "Add project"}
            </button>
            {form.id ? (
              <button type="button" onClick={resetForm} className="tap-target self-start font-display text-sm text-ink-soft">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-2xl font-medium tracking-[-0.03em]">Projects</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.id} className="border border-line p-4">
              {project.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.images[0].url} alt="" className="h-40 w-full object-cover" />
              ) : null}
              <p className="mt-3 font-display font-medium">{project.address}</p>
              <p className="text-sm text-ink-soft">
                {project.area} · {project.group}
                {project.sf ? ` · ${project.sf} sf` : ""}
                {project.year ? ` · ${project.year}` : ""}
              </p>
              <div className="mt-3 flex gap-4">
                <button
                  type="button"
                  onClick={() => editProject(project)}
                  className="tap-target border-b border-accent font-display text-sm"
                  style={{ color: "var(--color-accent)" }}
                >
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(project.id)} className="tap-target font-display text-sm" style={{ color: "var(--color-accent)" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 ? <p className="text-ink-soft">No projects yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
