// app/indexes/[address]/page.tsx

import IndexesManager from "@/components/indexes/IndexesManager";
import React from "react";

export const dynamic = "force-dynamic";

// This is important - it tells Next.js this is a dynamic route that should be handled at runtime
export async function generateStaticParams() {
  return []; // Empty array means all paths will be handled at runtime
}

export default async function SetDetails({
  params,
}: {
  params: { indexAddress: string };
}) {
  return <IndexesManager />;
}
