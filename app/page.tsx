"use client";

import { useEffect, useState } from "react";
import { SortingState } from "@tanstack/react-table";

import { getData, Issue } from "@/lib/api";
import Loading from "@/app/loading";
import Table from "./components/Table";

export default function Home() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pagination, setPagination] = useState<number>(10);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [data, setData] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [noMoreData, setNoMoreData] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const primarySort = sorting[0] ?? { id: "created_at", desc: false };
        const result = await getData({
          page: pageNumber,
          per_page: pagination,
          sort: primarySort.id,
          direction: primarySort.desc ? "desc" : "asc",
        });

        setData(result);
        setNoMoreData(result.length < pagination);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sorting, pageNumber, pagination]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white text-orange-600 font-bold text-2xl flex items-center pl-14 h-14  shadow">
        Getting Data
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="p-14 w-full">
          {loading && <Loading />}
          {!loading && error && <p className="text-red-500">{error}</p>}
          {!loading && !error && data.length === 0 && (
            <p>No data available for the current selection.</p>
          )}
          {!loading && !error && data.length > 0 && (
            <Table data={data} sorting={sorting} setSorting={setSorting} />
          )}
        </div>
      </main>{" "}
      <footer className="sticky bottom-0 z-10 bg-white flex gap-4 flex-wrap items-center justify-center w-full h-24  shadow">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page: {pageNumber}</span>
        <button
          disabled={loading || noMoreData}
          onClick={() => setPageNumber((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
        <label htmlFor="pageSize" className="ml-4 font-medium">
          Rows per page:
        </label>
        <select
          id="pageSize"
          value={pagination}
          onChange={(e) => {
            setPagination(Number(e.target.value));
            setPageNumber(1);
          }}
          className="px-2 py-2 border rounded"
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </footer>
    </div>
  );
}
