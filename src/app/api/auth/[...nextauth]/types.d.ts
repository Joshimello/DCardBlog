import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {} & DefaultSession["user"]
    login: string,
    accessToken: string,
    id: string
  }
}