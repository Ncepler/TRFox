import type { Project } from "@/data/projects";
import ProjectFrame from "@/components/ProjectFrame";

export default function ProjectEntry({ project }: { project: Project }) {
  return (
    <div className="max-w-[62ch] rounded-2xl border border-line p-6 shadow-sm">
      {project.images && project.images.length > 0 ? (
        <ProjectFrame
          address={project.address}
          area={project.area}
          sf={project.sf}
          images={project.images}
        />
      ) : null}
      <p className="mt-4 font-display text-xl font-medium tracking-[-0.03em] first:mt-0 md:text-2xl">
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
    </div>
  );
}
