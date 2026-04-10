/**
 * NextAuth v5 entry point.
 *
 * Exports `auth`, `signIn`, `signOut` handlers configured with our auth config.
 */
import NextAuth from 'next-auth';
import { authConfig } from './config';

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

// Augment NextAuth session type to include user.id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
