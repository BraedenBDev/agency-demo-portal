import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInAction } from '@/app/admin/actions';

export function SigninForm({ failed }: { failed?: boolean }) {
  return (
    <main className="mx-auto max-w-sm px-6 sm:px-8 pt-32 pb-32 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.18em] uppercase text-white-40">
          Almost Impossible · Admin
        </span>
        <h1 className="font-editorial italic text-[clamp(40px,8vw,72px)] leading-[0.95] tracking-[-0.03em] text-white-pure">
          Sign in.
        </h1>
      </div>
      <form action={signInAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-[11px] tracking-[0.18em] uppercase text-white-40">
          Username
          <Input
            name="username"
            autoComplete="username"
            defaultValue="admin"
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[11px] tracking-[0.18em] uppercase text-white-40">
          Password
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
          />
        </label>
        {failed && (
          <p className="text-sm text-red-400">Invalid credentials.</p>
        )}
        <Button type="submit" className="mt-2">
          Enter
        </Button>
      </form>
    </main>
  );
}
