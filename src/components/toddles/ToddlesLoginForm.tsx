import { loginAction } from "@/app/toddles/actions";

export default function ToddlesLoginForm({ error }: { error?: boolean }) {
  return (
    <form
      action={loginAction}
      className="mt-8 flex max-w-xs flex-col gap-4 rounded-2xl border border-line bg-canvas p-6 shadow-sm"
    >
      <label className="flex flex-col gap-2">
        <span className="font-display text-sm text-ink-soft">Password</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="w-full rounded-lg border border-line bg-canvas px-3 py-2 text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </label>
      {error ? <p className="text-sm" style={{ color: "var(--color-accent)" }}>Incorrect password.</p> : null}
      <button
        type="submit"
        className="tap-target inline-flex w-fit items-center justify-center self-start rounded-full bg-ink px-5 py-2.5 font-display text-sm text-canvas transition-transform duration-150 active:scale-[0.97]"
      >
        Enter
      </button>
    </form>
  );
}
