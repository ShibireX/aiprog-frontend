
"use client";
import { useState } from "react";

const placeholderPapers = [
  { name: "Understanding AI: A Survey", author: "Jane Doe" },
  { name: "Deep Learning Advances", author: "John Smith" },
  { name: "Quantum Computing 101", author: "Alice Johnson" },
  { name: "Neural Networks Explained", author: "Bob Brown" },
];

const sortOptions = [
  { value: "az", label: "Alphabetical (A-Z)" },
  { value: "za", label: "Alphabetical (Z-A)" },
];

export default function AcademicPapersView() {
  const [sortOrder, setSortOrder] = useState("az");

  const sortedPapers = [...placeholderPapers].sort((a, b) => {
    if (sortOrder === "az") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  return (
    <div className="w-full min-h-screen px-4 py-16 flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-blue-900 text-center">Academic Papers</h1>
        <div className="mb-6 flex justify-end">
          <label htmlFor="sort" className="mr-2 font-medium text-blue-900">Sort by:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <ul>
          {sortedPapers.map((paper, idx) => (
            <li key={idx} className="mb-4 p-4 bg-blue-50 rounded shadow-sm">
              <div className="text-lg font-semibold text-blue-800">{paper.name}</div>
              <div className="text-sm text-blue-600">Author: {paper.author}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
