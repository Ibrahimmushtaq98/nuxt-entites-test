
import 'reflect-metadata'; // Required for TypeORM

import { NuxtAuthHandler } from '#auth'
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"
import { DuendeISUser } from 'next-auth/providers/duende-identity-server6';
import GitHubProvider from 'next-auth/providers/github'
import * as entities from "~/external/entities"

import { JWT } from 'next-auth/jwt';
import { TypeORMAdapter } from '@auth/typeorm-adapter';

const useSecureCookies = true;

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
    providers: [
        GitHubProvider.default({
          clientId: process.env.GITHUB_ID as string,
          clientSecret: process.env.GITHUB_SECRET as string,
        }),
    ],
    adapter: TypeORMAdapter({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionTimeout: 3000,
      entities: entities,
      synchronize: false, // DONT ALLOW TRUE IN PROD
      dropSchema: false, // DONT ALLOW TRUE IN PROD
      logging: false,
      options: {
        encrypt: true,
      },
      extra:{
        trustServerCertificate: false
      }
    }),
    debug: true,
})