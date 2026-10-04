import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUserAndWorkspace } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getCurrentUserAndWorkspace();
  if (!auth) {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}

