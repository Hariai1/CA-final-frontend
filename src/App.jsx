import React, { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState([]);
  const [fullData, setFullData] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setPreview(data.preview || []);
    setFullData(data.full_data || {});
    setSelectedId(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-800">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">CA Final Q&A Search</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter your query"
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>

        {selectedId ? (
          <div className="mt-6 p-4 bg-white shadow rounded">
            <h2 className="font-semibold mb-2">Full Result</h2>
            {Object.entries(fullData[selectedId]).map(([key, value]) => (
              <div key={key} className="mb-2">
                <strong>{key}: </strong> {value}
              </div>
            ))}
            <button onClick={() => setSelectedId(null)} className="mt-4 text-blue-600 underline">
              Back to Results
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Matches:</h2>
            {preview.map((text, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-gray-200 p-2 border rounded mb-2"
                onClick={() => setSelectedId((index + 1).toString())}
              >
                {text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
