import { useState } from "react";
import "./index.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [noResult, setNoResult] = useState(false);

  const handleSearch = async () => {
    const res = await fetch("https://ca-final-backend.onrender.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResults(data.result || []);
    setSelectedResult(null);
    setNoResult((data.result || []).length === 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex min-h-screen text-white">
      {/* Main content area */}
      <div className="flex flex-col justify-center items-center flex-grow p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          CA Final FR – Inventory Q&A Tool
        </h1>

        {!selectedResult && (
          <>
            <div className="flex w-full max-w-xl space-x-2 mb-4">
              <input
                className="w-full px-4 py-2 rounded text-black"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your search (e.g., 'valuation of inventory')"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-white text-black rounded"
              >
                Search
              </button>
            </div>
            {noResult && <p className="text-red-400 mt-4">No results found.</p>}
            <div className="space-y-2 max-w-xl w-full mt-4">
              {results.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedResult(item)}
                  className="bg-gray-800 p-3 rounded w-full text-left hover:bg-gray-700"
                >
                  {item.question.split(" ").slice(0, 10).join(" ")}...
                </button>
              ))}
            </div>
          </>
        )}

        {selectedResult && (
          <div className="max-w-2xl w-full bg-gray-800 p-6 rounded mt-6">
            <button
              onClick={() => setSelectedResult(null)}
              className="mb-4 text-sm text-blue-400 hover:underline"
            >
              ← Back to Results
            </button>
            <p><strong>Chapter:</strong> {selectedResult.chapter}</p>
            <p><strong>Source:</strong> {selectedResult.sourceDetails}</p>
            <p><strong>Concept:</strong> {selectedResult.conceptTested}</p>
            <p><strong>Concept Summary:</strong> {selectedResult.conceptSummary}</p>
            <p><strong>Question:</strong> {selectedResult.question}</p>
            <p><strong>Answer:</strong> {selectedResult.answer}</p>
            <p><strong>How to Approach:</strong> {selectedResult.howToApproach}</p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-[#1a1a1a] border-l border-gray-700 p-4 hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:text-blue-400">New Chat</a></li>
          <li><a href="#" className="hover:text-blue-400">All</a></li>
          <li><a href="#" className="hover:text-blue-400">CA Final</a></li>
          <li><a href="#" className="hover:text-blue-400">CA Inter</a></li>
          <li><a href="#" className="hover:text-blue-400">CA Foundation</a></li>
          <li><a href="#" className="hover:text-blue-400">CMA Final</a></li>
          <li><a href="#" className="hover:text-blue-400">CMA Inter</a></li>
          <li><a href="#" className="hover:text-blue-400">CMA Foundation</a></li>
          <li><a href="#" className="hover:text-blue-400">CS Professional</a></li>
          <li><a href="#" className="hover:text-blue-400">CS Executive</a></li>
          <li><a href="#" className="hover:text-blue-400">CS Foundation</a></li>
        </ul>
      </div>
    </div>
  );
}

export default App;
