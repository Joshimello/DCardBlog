import type { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const options: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "public_repo,issues:write",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        id: token.sub,
        login: token.name,
        accessToken: token.accessToken,
      };
    },
    async jwt({ token, account }) {
      if (account) {
        token.login = account.login;
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/",
  },
};
