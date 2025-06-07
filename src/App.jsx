import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [matchedQuestions, setMatchedQuestions] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [cachedResults, setCachedResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = async (customQuery) => {
    const searchText = customQuery || query;
    if (!searchText.trim()) return;

    setLoading(true);
    setSelectedResult(null);
    setNoResults(false);

    try {
      const response = await fetch('https://ca-final-backend.onrender.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchText }),
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

        // Add to search history only if it’s not from history click
        if (!customQuery) {
          setSearchHistory((prev) => [
            searchText,
            ...prev.filter((q) => q !== searchText),
          ]);
        }
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
    <div className="flex h-screen bg-gray-900 text-white relative">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 text-white bg-gray-700 px-3 py-2 text-sm rounded hover:bg-gray-600"
      >
        {sidebarOpen ? '❌' : '☰'}
      </button>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-60' : 'w-0'} transition-all duration-300 bg-gray-800 overflow-hidden`}
      >
        <div className="p-4">
          {sidebarOpen && (
            <>
              <h2 className="text-lg font-bold border-b border-gray-700 pb-2 mt-4">Categories</h2>
              <div className="space-y-2 mt-2">
                {[
                  'CA Final', 'CA Inter', 'CA Foundation',
                  'CMA Final', 'CMA Inter', 'CMA Foundation',
                  'CS Professional', 'CS Executive', 'CS Foundation',
                ].map((cat) => (
                  <div key={cat} className="text-sm hover:bg-gray-700 p-2 rounded cursor-pointer">
                    {cat}
                  </div>
                ))}
              </div>

              <h2 className="text-md font-semibold border-b border-gray-600 pb-1 mt-6">Search History</h2>
              <div className="space-y-1 mt-2">
                {searchHistory.length === 0 ? (
                  <div className="text-xs text-gray-400 italic">No history yet</div>
                ) : (
                  searchHistory.map((q, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setQuery(q);
                        handleSearch(q);
                      }}
                      className="text-xs text-gray-300 hover:text-white cursor-pointer truncate"
                    >
                      🔁 {q}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 pt-8 pb-24 px-4 sm:px-8 flex flex-col items-center overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">CA Final Inventory Q&A</h1>

        {loading && <div className="mt-4 text-gray-300 text-sm">🔄 Searching...</div>}
        {noResults && <div className="mt-4 text-red-400 text-sm">❌ No results found.</div>}

        {!selectedResult && matchedQuestions.length > 0 && (
          <div className="mt-2 w-full max-w-3xl space-y-3">
            <h2 className="text-lg font-semibold mb-2">Matched Questions:</h2>
            {matchedQuestions.map((res, index) => (
              <div
                key={index}
                onClick={() => handleSelect(res)}
                className="bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-gray-700 text-justify"
              >
                <span className="font-semibold">Q{index + 1}:</span>{" "}
                {res.question?.length > 0
                  ? res.question.slice(0, 50) + (res.question.length > 50 ? "..." : "")
                  : "No question text"}
              </div>
            ))}
          </div>
        )}

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

      {/* Fixed Bottom Search Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-700 flex justify-center z-40">
        <div className="w-full max-w-3xl flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your query and press Enter..."
            className="flex-grow p-3 text-black rounded-l-md border border-gray-400"
          />
          <button
            onClick={() => handleSearch()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
