import { readProjects } from "@/lib/blob";
import { isAuthed } from "@/lib/toddlesAuth";
import ToddlesLoginForm from "@/components/toddles/ToddlesLoginForm";
import ToddlesAdmin from "@/components/toddles/ToddlesAdmin";

export const dynamic = "force-dynamic";

export default async function ToddlesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authed = await isAuthed();

  if (!authed) {
    const { error } = await searchParams;
    return (
      <div className="mx-auto max-w-sm px-6 py-24 md:px-10">
        <h1 className="font-display text-2xl font-medium tracking-[-0.03em]">Toddles</h1>
        <ToddlesLoginForm error={error === "1"} />
      </div>
    );
  }

  const projects = await readProjects();
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <h1 className="font-display text-4xl font-medium tracking-[-0.03em] md:text-5xl">Toddles</h1>
      <ToddlesAdmin initialProjects={projects} />
    </div>
  );
}
