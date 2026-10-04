import React from "react";
import { getSession } from "@/lib/auth/session";
import { getSequencesSafe } from "@/lib/mockData";
import { SequencesClientView } from "@/components/sequences/SequencesClientView";

export const dynamic = "force-dynamic";

export default async function SequencesPage() {
  const session = await getSession();
  const sequences = await getSequencesSafe(session?.workspaceId);

  return <SequencesClientView initialSequences={sequences as any} />;
}
