import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function isOwnerEmail(email: string | null | undefined) {
  const ownerEmail = process.env.AUTH_OWNER_EMAIL?.trim().toLowerCase();
  return Boolean(ownerEmail && email?.trim().toLowerCase() === ownerEmail);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn({ account, user }) {
      return account?.provider === "google" && isOwnerEmail(user.email);
    },
    authorized({ auth: session }) {
      return isOwnerEmail(session?.user?.email);
    },
  },
});
