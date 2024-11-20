import { NuxtAuthHandler } from '#auth'
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"
import { DuendeISUser } from 'next-auth/providers/duende-identity-server6';
import GitHubProvider from 'next-auth/providers/github'
import { TypeORMLegacyAdapter } from '@next-auth/typeorm-legacy-adapter';
import { JWT } from 'next-auth/jwt';

const useSecureCookies = true;
try{
  const adapter = TypeORMLegacyAdapter({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "1433", 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    options: {
      encrypt: true,
    },
  });
  console.log('Adapter initialized:', adapter);
}catch(error){
  console.error(error);
}

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
    providers: [
        // GitHubProvider.default({
        //   clientId: process.env.GITHUB_ID as string,
        //   clientSecret: process.env.GITHUB_SECRET as string,
        // }),
        DuendeIDS6Provider.default({
            // Id of the provider 
            id: 'identityserver',
            name: 'Labourly Identity Server',
            
            // Client value, this was set in Duende Identity and must follow that id
            clientId: process.env.CLIENT_IDENTITY_ID,
            clientSecret: process.env.CLIENT_IDENTITY_SECRET,
            issuer: process.env.NUXT_PUBLIC_IDENTITY_BASE_URL,
            authorization: {
                url: `${process.env.NUXT_PUBLIC_IDENTITY_BASE_URL}/connect/authorize`,
                params: {
                  scope: 'openid profile api1 offline_access',
                  response_type: 'code',
                },
            },
            token: {
                url: `${process.env.NUXT_PUBLIC_IDENTITY_BASE_URL}/connect/token`,
                params: {
                  grant_type: 'authorization_code',
                  redirect_uri: `${process.env.NUXT_PUBLIC_FRONTEND_SECONDARY_BASE_URL}/api/auth/callback/identityserver`
                }
            },
            userinfo: `${process.env.NUXT_PUBLIC_IDENTITY_BASE_URL}/connect/userinfo`,
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
            redirect: process.env.NUXT_PUBLIC_FRONTEND_SECONDARY_BASE_URL,
        }),
    ],
    // adapter: TypeORMLegacyAdapter({
    //   type: 'mssql',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT || "1433", 10),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   connectionTimeout: 3000,
    //   synchronize: true,
    //   options: {
    //     encrypt: true,
    //   },
    // }),
    // cookies: {
    //     sessionToken: {
    //       name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
    //       options: {
    //         httpOnly: true,
    //         sameSite: 'none',
    //         path: '/',
    //         domain: '.laborly.io',
    //         secure: useSecureCookies,
		// 	//maxAge: 60 * 5,
		// 	//expires: new Date(Date.now() + 5 * 60 * 1000)
    //       },
    //     },
    // },
	// callbacks: {
	// 	async jwt({ token, account, profile }){
	// 	  // When a new session is created, save role and name from profile
	// 	  if (account && profile) {
	// 		token.accessToken = account.access_token;
	// 		token.refreshToken = account.refresh_token;
	// 		token.id_token = account.id_token;
	// 		token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
	// 		token.name = profile.name;
	// 		token.role = profile.role || 'user'; // Store role in the token
	// 	  }
	// 	  return token;
	// 	},
	//   },
    debug: true,
    useSecureCookies: true,
})