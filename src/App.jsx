import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [semanticResults, setSemanticResults] = useState([]);
  const [tagResults, setTagResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch("https://ca-final-backend.onrender.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log("Search result:", data);

      setSemanticResults(data.semantic_results || []);
      setTagResults(data.tag_results || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">CA Final FR – Inventory Q&A Tool</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter search keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-4 py-2 rounded text-black w-96"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {semanticResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">🔍 Semantic Matches</h2>
          {semanticResults.map((item, index) => (
            <div key={index} className="bg-gray-800 p-4 mb-4 rounded-lg">
              <p><strong>Chapter:</strong> {item.chapter}</p>
              <p><strong>Source:</strong> {item.sourceDetails}</p>
              <p><strong>Concept:</strong> {item.conceptTested}</p>
              <p><strong>Summary:</strong> {item.conceptSummary}</p>
              <p><strong>Question:</strong> {item.question}</p>
              <p><strong>Answer:</strong> {item.answer}</p>
              <p><strong>How to Approach:</strong> {item.howToApproach}</p>
            </div>
          ))}
        </div>
      )}

      {tagResults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2 mt-6">🏷️ Tag Matches</h2>
          {tagResults.map((item, index) => (
            <div key={index} className="bg-gray-800 p-4 mb-4 rounded-lg">
              <p><strong>Chapter:</strong> {item.chapter}</p>
              <p><strong>Source:</strong> {item.sourceDetails}</p>
              <p><strong>Concept:</strong> {item.conceptTested}</p>
              <p><strong>Summary:</strong> {item.conceptSummary}</p>
              <p><strong>Question:</strong> {item.question}</p>
              <p><strong>Answer:</strong> {item.answer}</p>
              <p><strong>How to Approach:</strong> {item.howToApproach}</p>
            </div>
          ))}
        </div>
      )}

      {semanticResults.length === 0 && tagResults.length === 0 && (
        <p className="mt-4 text-red-400">❗ No results found.</p>
      )}
    </div>
  );
}

export default App;
