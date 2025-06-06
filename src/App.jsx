import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [matchedQuestions, setMatchedQuestions] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [cachedResults, setCachedResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSelectedResult(null);
    setNoResults(false);

    try {
      const response = await fetch('https://ca-final-backend.onrender.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      const results = data.results || [];

      if (results.length === 0) {
        setMatchedQuestions([]);
        setCachedResults([]);
        setNoResults(true);
      } else {
        setMatchedQuestions(results);
        setCachedResults(results);
        setNoResults(false);
      }
    } catch (error) {
      console.error('❌ Error fetching results:', error);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSelect = (result) => {
    setSelectedResult(result);
  };

  const handleBack = () => {
    setSelectedResult(null);
    setMatchedQuestions(cachedResults);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 p-4 space-y-4">
        <h2 className="text-lg font-bold border-b border-gray-700 pb-2">Categories</h2>
        {[
          'CA Final', 'CA Inter', 'CA Foundation',
          'CMA Final', 'CMA Inter', 'CMA Foundation',
          'CS Professional', 'CS Executive', 'CS Foundation'
        ].map((cat) => (
          <div key={cat} className="text-sm hover:bg-gray-700 p-2 rounded cursor-pointer">
            {cat}
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-8 flex flex-col items-center overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">CA Final Inventory Q&A</h1>

        <div className="w-full max-w-2xl flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your query (e.g., %example, #14000)"
            className="flex-grow p-3 text-black rounded-l-md border-2 border-r-0 border-gray-400"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading && <div className="mt-4 text-gray-300 text-sm">🔄 Searching...</div>}
        {noResults && <div className="mt-4 text-red-400 text-sm">❌ No results found.</div>}

        {/* Match List */}
        {!selectedResult && matchedQuestions.length > 0 && (
          <div className="mt-6 w-full max-w-3xl space-y-3">
            <h2 className="text-lg font-semibold mb-2">Matched Questions:</h2>
            {matchedQuestions.map((res, index) => (
              <div
                key={index}
                onClick={() => handleSelect(res)}
                className="bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-gray-700"
              >
                <span className="font-semibold">Q:</span>{" "}
                {res.question?.length > 0
                  ? res.question.slice(0, 100) + (res.question.length > 100 ? "..." : "")
                  : "No question text"}
              </div>
            ))}
          </div>
        )}

        {/* Selected Result Detail View */}
        {selectedResult && (
          <div className="mt-6 w-full max-w-4xl space-y-3 bg-gray-800 p-6 rounded-lg">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-700 text-sm rounded hover:bg-gray-600"
            >
              ← Back to Results
            </button>
            <div><strong>Chapter:</strong> {selectedResult.chapter || "N/A"}</div>
            <div><strong>Source:</strong> {selectedResult.sourceDetails || "N/A"}</div>
            <div><strong>Concept:</strong> {selectedResult.conceptTested || "N/A"}</div>
            <div><strong>Concept Summary:</strong> {selectedResult.conceptSummary || "N/A"}</div>
            <div><strong>Question:</strong> {selectedResult.question || "N/A"}</div>
            <div><strong>Answer:</strong> {selectedResult.answer || "N/A"}</div>
            <div><strong>How to Approach:</strong> {selectedResult.howToApproach || "N/A"}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
