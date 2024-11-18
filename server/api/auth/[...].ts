import { NuxtAuthHandler } from '#auth'
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"
import { DuendeISUser } from 'next-auth/providers/duende-identity-server6';
import { JWT } from 'next-auth/jwt';

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
    //https://auth.sidebase.io/guide/authjs/nuxt-auth-handler#providers
    // Until next-auth 5 comes out (current version is 4.21.1 DO NOT CHANGE with Reason: https://auth.sidebase.io/guide/authjs/quick-start#installation)
    // .default will need to be put for each provider. Ignore the error
    providers: [
      //https://next-auth.js.org/providers/duende-identityserver6
        DuendeIDS6Provider.default({
            // Id of the provider 
            id: 'identityserver',
            name: 'Labourly Identity Server',
            
            // Client value, this was set in Duende Identity and must follow that id
            clientId: process.env.CLIENT_IDENTITY_ID,
            clientSecret: process.env.CLIENT_IDENTITY_SECRET,
            issuer: process.env.IDENTITY_BASE_URL,
            authorization: {
            url: `${process.env.IDENTITY_BASE_URL}/connect/authorize`,
            params: {
                scope: 'openid profile api1 offline_access',
                response_type: 'code',
            },
            },
            token: {
            url: `${process.env.IDENTITY_BASE_URL}/connect/token`,
            params: {
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.FRONTEND_SECONDARY_BASE_URL}/api/auth/callback/identityserver`
            }
            },
            userinfo: `${process.env.IDENTITY_BASE_URL}/connect/userinfo`,
            //checks: ['pkce'],
            checks: [],
            idToken: true,
            profile(profile: DuendeISUser, token: JWT) {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                token: token
            };
            },
            // Force HTTPS on redirect and callback
            redirect: process.env.FRONTEND_SECONDARY_BASE_URL,
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }){
          // When a new session is created, save role and name from profile
          if (account && profile) {
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
            token.id_token = account.id_token;
            token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
            token.name = profile.name;
            token.role = profile.role || 'user'; // Store role in the token
          }
    
          // If the token has expired, refresh it
        //   if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
        //     return await refreshAccessTokenIdentity(token);
        //   }
          return token;
        },  
        async session({ session, token }) {
          // Attach role and name to session.user from token
          session.user = {
            ...session.user,
            role: token.role!,
          };
          session.token = token;
          return session;
        },
      },
    debug: true,
    useSecureCookies:true
});