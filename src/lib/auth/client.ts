"use client";

import { signOut } from "next-auth/react";

export async function signOutFromApp() {
  await signOut({ redirectTo: "/sign-in" });
}
