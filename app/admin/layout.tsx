import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { SigninForm } from '@/components/admin/signin-form';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    const failed = (await cookies()).get('demo_portal_signin_failed')?.value === '1';
    return <SigninForm failed={failed} />;
  }
  return <>{children}</>;
}
