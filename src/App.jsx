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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    setResults(data.result || []);
    setLoading(false);
  };

  const handleSelect = (result) => {
    setSelectedResult(result);
    setResults([]); // Hide matched list
  };

  const truncateQuestion = (text) => {
    const words = text.split(" ");
    return words.length <= 10 ? text : words.slice(0, 10).join(" ") + "...";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">CA Final FR Q&A Search</h1>
        <div className="flex mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow border border-gray-400 p-2 rounded-l"
            placeholder="Enter your search query..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Searching...</p>}

        {/* Show Matched Questions */}
        {results.length > 0 && !selectedResult && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Matched Questions</h2>
            <ul className="space-y-2">
              {results.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-700 hover:underline"
                  onClick={() => handleSelect(item)}
                >
                  {truncateQuestion(item.question)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Show Selected Full Result */}
        {selectedResult && (
          <div className="mt-6 bg-white p-6 rounded shadow space-y-4">
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
