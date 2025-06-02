import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);

  const handleSearch = async () => {
    setSelectedResult(null); // Reset selection
    const response = await fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    console.log("Search result:", data);

    if (Array.isArray(data.result)) {
      setResults(data.result);
    } else {
      console.error("Unexpected response format:", data);
      setResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPreview = (text) => {
    if (!text) return '';
    return text.split(' ').slice(0, 10).join(' ') + '...';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">CA Final FR – Inventory Q&A Tool</h1>

      {/* ✅ Search input and button */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-2 w-full rounded text-black"
            placeholder="Enter your query..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* ✅ Vertical list of previews */}
      {results.length > 1 && !selectedResult && (
        <div className="space-y-2">
          <p className="font-semibold mb-2">Multiple results found. Please select one:</p>
          <div className="flex flex-col gap-2">
            {results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedResult(res)}
                className="text-left w-full p-2 border rounded bg-gray-700 hover:bg-gray-600"
              >
                {getPreview(res.question)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Show full result */}
      {(results.length === 1 || selectedResult) && (
        <div className="mt-6 border p-4 rounded bg-gray-800 shadow space-y-2">
          <p><strong>Chapter:</strong> {(selectedResult || results[0]).chapter}</p>
          <p><strong>Source:</strong> {(selectedResult || results[0]).sourceDetails}</p>
          <p><strong>Concept:</strong> {(selectedResult || results[0]).conceptTested}</p>
          <p><strong>Concept Summary:</strong> {(selectedResult || results[0]).conceptSummary}</p>
          <p><strong>Question:</strong> {(selectedResult || results[0]).question}</p>
          <p><strong>Answer:</strong> {(selectedResult || results[0]).answer}</p>
          <p><strong>How to Approach:</strong> {(selectedResult || results[0]).howToApproach}</p>
        </div>
      )}
    </div>
  );
}

export default App;
