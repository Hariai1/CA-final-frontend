import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch("https://ca-final-backend.onrender.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      if (data.result && data.result.length > 0) {
        setResults(data.result);
        setNoResults(false);
        setViewingDetails(false);
        setSelectedResult(null);
      } else {
        setResults([]);
        setNoResults(true);
        setViewingDetails(false);
        setSelectedResult(null);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setNoResults(true);
    }
  };

  const handleSelect = (item) => {
    setSelectedResult(item);
    setViewingDetails(true);
  };

  const handleBack = () => {
    setSelectedResult(null);
    setViewingDetails(false);
  };

  const getFirstWords = (text, count) => {
    return text.split(" ").slice(0, count).join(" ") + "...";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">CA Final FR – Inventory Q&A Tool</h1>

      <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-2xl gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Type your search (e.g., 'valuation of inventory')"
          className="w-full px-4 py-2 text-black rounded-md"
        />
        <button
          onClick={handleSearch}
          className="bg-white text-black px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>

      {noResults && <p className="text-red-400 mt-4">No results found.</p>}

      {!viewingDetails && results.length > 0 && (
        <div className="flex flex-col items-center gap-2 w-full max-w-3xl">
          <p className="mb-2 text-sm text-gray-400">Multiple results found. Please select one:</p>
          {results.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item)}
              className="bg-gray-700 hover:bg-gray-600 w-full text-left px-4 py-2 rounded-md text-sm"
            >
              {getFirstWords(item.question, 10)}
            </button>
          ))}
        </div>
      )}

      {viewingDetails && selectedResult && (
        <div className="bg-gray-800 rounded-md shadow-md p-6 mt-6 w-full max-w-3xl">
          <button
            onClick={handleBack}
            className="mb-4 text-sm text-blue-400 hover:underline"
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
