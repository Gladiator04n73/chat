'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from './providers/AuthProvider';
import { useEffect } from 'react';
import AuthLayout from './profile/[id]/layout';

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/feed');
      } else {
        router.push('/auth');
      }
    }
  }, [user, loading, router]);

  return (
    <AuthLayout title="Welcome" username={user ? user.nickname : null}>
    </AuthLayout>
  );
}