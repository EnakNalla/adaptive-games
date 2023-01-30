import {prisma} from "@ag/db";
import {PrismaAdapter} from "@next-auth/prisma-adapter";
import {type NextAuthOptions} from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureADB2CProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID as string,
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET as string,
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
      authorization: {params: {scope: "offline_access openid"}}
    })
  ],
  callbacks: {
    session({session, user}) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};
