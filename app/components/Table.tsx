"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  OnChangeFn,
  VisibilityState,
} from "@tanstack/react-table";

import { Issue } from "@/lib/api";
import { formatDateToDDMMYYYY } from "@/lib/utils";

type Props = {
  data: Issue[];
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
};

export default function Table({ data, sorting, setSorting }: Props) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const stored = localStorage.getItem("columnVisibility");
      return stored ? JSON.parse(stored) : {};
    }
  );

  useEffect(() => {
    localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const [filters, setFilters] = useState({
    title: "",
    state: "",
  });

  const columns = useMemo<ColumnDef<Issue>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "Title",
        enableSorting: true,
        cell: ({ getValue }) => (
          <div className="w-[800px] h-[20px] overflow-hidden text-ellipsis whitespace-nowrap">
            {getValue<string>()}
          </div>
        ),
      },
      {
        accessorKey: "state",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const isOpen = status === "open";
          const bg = isOpen ? "bg-green-100" : "bg-red-100";
          const text = isOpen ? "text-green-800" : "text-red-800";
          const dot = isOpen ? "bg-green-500" : "bg-red-500";

          return (
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}
            >
              <span className={`w-2 h-2 mr-2 rounded-full ${dot}`}></span>
              {status}
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        enableSorting: true,
        cell: ({ getValue }) => formatDateToDDMMYYYY(getValue<string>()),
      },
      {
        accessorKey: "updated_at",
        header: "Updated At",
        enableSorting: true,
        cell: ({ getValue }) => formatDateToDDMMYYYY(getValue<string>()),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleFilterChange = (
    columnId: keyof typeof filters,
    value: string
  ) => {
    table.getColumn(columnId)?.setFilterValue(value);
    setFilters((prev) => ({ ...prev, [columnId]: value }));
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      {/* Filters and Column Toggle */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between gap-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-6">
          <div>
            <label
              htmlFor="title-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Title:
            </label>
            <input
              id="title-filter"
              type="text"
              value={filters.title}
              onChange={(e) => handleFilterChange("title", e.target.value)}
              className="mt-1 block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
              placeholder="Search title..."
            />
          </div>

          {/* State Filter */}
          <div>
            <label
              htmlFor="state-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by State:
            </label>
            <select
              id="state-filter"
              value={filters.state}
              onChange={(e) => handleFilterChange("state", e.target.value)}
              className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Column Toggle */}
        <div>
          <span className="block text-sm font-medium text-gray-700">
            Toggle Columns:
          </span>
          <div className="flex flex-wrap gap-4">
            {table.getAllLeafColumns().map((column) => (
              <label
                key={column.id}
                className="flex items-center gap-1 text-sm"
              >
                <input
                  type="checkbox"
                  className="accent-orange-300 text-white"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                {String(column.columnDef.header)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left font-medium text-orange-500 tracking-wider cursor-pointer select-none sticky top-0 bg-gray-50 z-10 text-base"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-3">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {isSorted === "asc" ? (
                        <FontAwesomeIcon
                          icon={faCaretUp}
                          className="text-gray-400 text-xs"
                        />
                      ) : isSorted === "desc" ? (
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          className="text-gray-400 text-xs"
                        />
                      ) : header.column.getCanSort() ? (
                        <FontAwesomeIcon
                          icon={faSort}
                          className="text-gray-400 text-xs"
                        />
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row, rowIdx) => (
            <tr
              key={row.id}
              className={
                rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100"
              }
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-gray-700"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
