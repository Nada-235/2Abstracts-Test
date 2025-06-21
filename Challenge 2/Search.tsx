import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ✅ Debounce Hook
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler); //Cleanup to avoid memory leaks
  }, [value, delay]);

  return debouncedValue;
}

// ✅ Main Search Component
export default function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 500);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      const res = await axios.get("/api/search", {
        params: { q: debouncedQuery },
      });
      return res.data;
    },
    enabled: !!debouncedQuery,
    staleTime: 5 * 60 * 1000, //Cache results (5 mins) to avoid re-fetch
  });

  return (
    <div className="max-w-md mx-auto mt-8 space-y-4">
      <input
        className="w-full border px-4 py-2 rounded shadow"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {error && (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      )}

      {isLoading && <p className="text-gray-500">Loading...</p>}

      <ul className="list-disc pl-6">
        {data.map((item: never) => (
          <li key={item.id || item}>{item.name || item}</li>
        ))}
      </ul>
    </div>
  );
}
