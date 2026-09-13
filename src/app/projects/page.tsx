import type { Metadata } from "next";
import ProjectEntry from "@/components/ProjectEntry";
import type { Project } from "@/data/projects";
import { readProjects } from "@/lib/blob";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project T.R. Fox Contracting has on record: Manhattan residences, Nassau County residences, and commercial and installation work.",
  openGraph: {
    title: "Projects, T.R. Fox Contracting",
    description:
      "Every project T.R. Fox Contracting has on record: Manhattan residences, Nassau County residences, and commercial and installation work.",
  },
};

const groups: { key: Project["group"]; heading: string }[] = [
  { key: "manhattan", heading: "Manhattan" },
  { key: "nassau", heading: "Nassau County" },
  { key: "commercial", heading: "Commercial and installations" },
];

export default async function ProjectsPage() {
  const projects = await readProjects();
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">Projects</h1>

      {groups.map((group) => {
        const entries = projects.filter((p) => p.group === group.key);
        if (entries.length === 0) return null;
        return (
          <section key={group.key} className="mt-16 first:mt-16">
            <h2 className="font-display text-2xl font-medium tracking-[-0.03em]">{group.heading}</h2>
            <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
              {entries.map((project) => (
                <ProjectEntry key={project.id} project={project} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
