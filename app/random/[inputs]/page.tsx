"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function DynamicPage() {
  const params = useParams();
  const inputs = params?.inputs as string | undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dynamic Page</h1>
      {inputs ? (
        <p className="text-xl mb-4">You entered: {inputs}</p>
      ) : (
        <p className="text-xl mb-4">No input provided</p>
      )}
      <Link
        href="/random"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Go Back
      </Link>
    </div>
  );
}
