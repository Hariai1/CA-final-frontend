import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    setSelectedResult(null);
    setNoResults(false);
    if (!query.trim()) return;

    try {
      const response = await fetch("https://ca-final-backend.onrender.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const matches = data?.result || [];

      if (matches.length === 0) {
        setNoResults(true);
      } else {
        setResults(matches);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSelect = (item) => {
    setSelectedResult(item);
    setResults([]);
  };

  const handleBack = () => {
    setSelectedResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        CA Final FR – Inventory Q&A Tool
      </h1>

      <div className="flex w-full max-w-xl items-center space-x-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your search (e.g., 'valuation of inventory')"
          className="flex-grow px-4 py-2 rounded border border-gray-400 text-black"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-white text-black font-semibold rounded"
        >
          Search
        </button>
      </div>

      {noResults && (
        <p className="text-red-400 text-sm mt-4">No results found. Try different keywords.</p>
      )}

      {!selectedResult && results.length > 0 && (
        <div className="flex flex-col items-start space-y-3 w-full max-w-3xl">
          <p className="text-sm text-gray-400 mb-2">Multiple results found. Select one:</p>
          {results.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item)}
              className="text-left bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition w-full"
            >
              {item.question.split(" ").slice(0, 10).join(" ")}...
            </button>
          ))}
        </div>
      )}

      {selectedResult && (
        <div className="bg-gray-800 p-6 rounded w-full max-w-3xl space-y-4 mt-6">
          <button
            onClick={handleBack}
            className="text-sm text-blue-400 underline hover:text-blue-300"
          >
            ← Back to results
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
  );
}

export default App;
