import type { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
    /* Returned by `useAuth`, `getSession` and `getServerSession` */
    interface Session extends DefaultSession {
      user: {
        name: string
        role: string
      }
      token: JWT
    }

    interface Profile extends Profile{
      role: string
    }
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken` */
    interface JWT {
      accessToken?: string;
      refreshToken?: string;
      id_token?: string;
      accessTokenExpires?: number;
      role?: string;
      name?: string;
      error?: string;
    }
}
