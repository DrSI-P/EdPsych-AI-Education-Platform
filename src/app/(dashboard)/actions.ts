'use server';

import { signOut as nextAuthSignOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

export async function signOut() {
  // Simply redirect to the sign out API route
  redirect('/api/auth/signout');
}