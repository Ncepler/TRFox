import type { Project } from "@/data/projects";
import ProjectGallery from "@/components/ProjectGallery";

export default function ProjectEntry({ project }: { project: Project }) {
  return (
    <div className="max-w-[62ch]">
      <p className="font-display text-xl font-medium tracking-[-0.03em] md:text-2xl">
        {project.address}
        {project.area ? <span className="text-ink-soft">, {project.area}</span> : null}
      </p>
      {(project.scope || project.year) && (
        <p className="mt-2 text-ink-soft">
          {project.scope}
          {project.scope && project.year ? ", " : ""}
          {project.year}
        </p>
      )}
      {project.sf ? (
        <p className="mt-2 font-display text-[0.8125rem] font-medium text-ink-soft">
          {project.sf.toLocaleString("en-US")} sf
        </p>
      ) : null}
      {project.photoCount ? (
        <ProjectGallery
          slug={project.id}
          address={project.address}
          scope={project.scope}
          photoCount={project.photoCount}
        />
      ) : null}
    </div>
  );
}
