export default function Loading() {
  return (
    <div className="overflow-x-auto shadow rounded-lg border border-gray-200 animate-pulse">
      <table className="w-full divide-y divide-gray-200 text-sm ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 w-[100%] text-left font-medium text-gray-400 h-11"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {[...Array(10)].map((_, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-white " : "bg-gray-50"}
            >
              {Array(1)
                .fill(0)
                .map((__, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 ">
                    <div className="h-7 bg-gray-200 rounded"></div>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
