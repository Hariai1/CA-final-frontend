import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSelectedResult(null);

    const response = await fetch("https://ca-final-backend.onrender.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    setResults(data.result || []);
    setLoading(false);
  };

  const handleSelect = (item) => {
    setSelectedResult(item);
    setResults([]);
  };

  const truncateQuestion = (text) => {
    const words = text.split(" ");
    return words.length <= 10 ? text : words.slice(0, 10).join(" ") + "...";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8">CA Final FR – Inventory Q&A Tool</h1>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Type your search (e.g., 'valuation of inventory')"
            className="w-full max-w-xl px-4 py-2 border border-gray-400 text-black rounded-l"
          />
          <button
            onClick={handleSearch}
            className="bg-white text-black font-semibold px-4 py-2 rounded-r hover:bg-gray-200"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-gray-300">Searching...</p>}

        {results.length > 0 && !selectedResult && (
          <div className="bg-white text-black p-4 rounded shadow space-y-2">
            <h2 className="font-semibold mb-2">Multiple results found. Please select one:</h2>
            {results.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer hover:text-blue-700"
                onClick={() => handleSelect(item)}
              >
                {truncateQuestion(item.question)}
              </div>
            ))}
          </div>
        )}

        {selectedResult && (
          <div className="mt-8 bg-white text-black p-6 rounded shadow space-y-3">
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
    </div>
  );
}

export default App;
