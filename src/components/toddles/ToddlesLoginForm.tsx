import { loginAction } from "@/app/toddles/actions";

export default function ToddlesLoginForm({ error }: { error?: boolean }) {
  return (
    <form action={loginAction} className="mt-8 flex max-w-xs flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-display text-sm text-ink-soft">Password</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:border-accent"
        />
      </label>
      {error ? <p className="text-sm" style={{ color: "var(--color-accent)" }}>Incorrect password.</p> : null}
      <button
        type="submit"
        className="tap-target self-start border-b border-accent font-display text-sm"
        style={{ color: "var(--color-accent)" }}
      >
        Enter
      </button>
    </form>
  );
}
