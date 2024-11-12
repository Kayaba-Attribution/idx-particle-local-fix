"use client";

import { useState } from "react";
import Link from "next/link";

export default function RandomPage() {
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Enter a Value</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something..."
        className="border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Input for dynamic page"
      />
      <Link
        href={input ? `/random/${input}` : "/random"}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Go to Dynamic Page
      </Link>
    </div>
  );
}
