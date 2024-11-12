// random/[input]/page.tsx
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type DynamicPageProps = {
  params: {
    input: string;
  };
};

export default function DynamicPage({ params }: DynamicPageProps) {
  const { input } = params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dynamic Page</h1>
      <p className="text-xl mb-4">You entered: {input}</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Go Back
      </button>
    </div>
  );
}
