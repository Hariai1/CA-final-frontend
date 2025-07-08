import React, { useState } from 'react';
import './index.css';
import { Search } from "lucide-react"; // ⬅️ Add this at top if not already

const courseSubjects = {
  "CA Final": [
    "Group I",
    "Financial Reporting",
    "Advanced Financial Management",
    "Advanced Auditing, Assurance and Professional Ethics",
    "Group II",
    "Direct Tax Laws & International Taxation",
    "Indirect Tax Laws",
    "Integrated Business Solutions"
  ],
  "CA Inter": [
    "Group I",
    "Advanced Accounting",
    "Corporate and other Laws",
    "Taxation",
    "Group II",
    "Cost and Management Accounting",
    "Auditing and Ethics",
    "Financial Management and Strategic Management"
  ],
  "CA Foundation": [
    "Accounting",
    "Business Laws",
    "Qunatitative Aptitude",
    "Business Economics"
  ],
  "CMA Final": [
    "Group III",
    "Corporate and Economic Laws",
    "Strategic Financial Management",
    "Direct Tax Laws and International Taxation",
    "Strategic Cost Management",
    "Group IV",
    "Cost and Management Audit",
    "Corporate Financial Reporting",
    "Indirect Tax Laws and practice",
    "Elective Paper"
  ],
  "CMA Inter": [
    "Group I",
    "Business Laws and Ethics",
    "Financial Accounting",
    "Direct and Indirect Taxation",
    "Cost Accounting",
    "Group II",
    "Operations Management and Strategic Management",
    "Corporate Accounting and Auditing",
    "Financial Management and Business Data Analytics",
    "Management Accounting"
  ],
  "CMA Foundation": [
    "Fundamentals of business Laws and Business Communications",
    "Fundamentals of Financial and cost Accounting",
    "Fundamentals of Business Mathematics and Statistics",
    "Fundamentals of Business Economics and Management"
  ],
  "CS Executive": [
    "Group 1",
    "Jurisprudence, Interpretation and General Laws",
    "Company Law & Practice",
    "Setting up of Business, Industrial & Labour Laws",
    "Corporate Accounting & Financial Management",
    "Group 2",
    "Capital Markets & Securities Laws",
    "Economics, Commercial & Intellectual Property Law",
    "Tax Laws and Practice"
  ],
  "CS Foundation": [
    "Business Environment and Law",
    "Business Management, Ethics & Entrepreneurship",
    "Business Economics",
    "Fundamentals of Accounting and Auditing"
  ],
  "CS Professional": [
    "Group 1",
    "Environmental, Social and Governance (ESG)",
    "Drafting, Pleadings & Appearances",
    "Compliance Management, Audit & Due Diligence",
    "Elective 1",
    "CSR & Social Governance",
    "Internal & Forensic Audit",
    "Intellectual Property Rights",
    "Artificial Intelligence, Data Analytics and Cyber Security",
    "Advanced Direct Tax Laws & Practice",
    "Group 2",
    "Strategic Management & Corporate Finance",
    "Corporate Restructuring, Valuation & Insolvency Corrigendum",
    "Elective 2",
    "Arbitration, Mediation & Conciliation",
    "GST & Corporate Tax Planning",
    "Labour Laws & Practice",
    "Banking & Insurance – Laws & Practice",
    "Insolvency and Bankruptcy – Law & Practice Corrigendum"
  ]
};

const App = () => {
  const [query, setQuery] = useState('');
  const [matchedQuestions, setMatchedQuestions] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [cachedResults, setCachedResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customApproach, setCustomApproach] = useState('');
  const [userId, setUserId] = useState('student_123'); // Replace with actual logic later
  const [userRole, setUserRole] = useState('student'); // 'admin' or 'student'

  const handleSearch = async (customQuery) => {
    const searchText = customQuery || query;
    if (!searchText.trim()) return;

    setLoading(true);
    setSelectedResult(null);
    setNoResults(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchText }),
      });

      const data = await response.json();
      const fullData = data.full_data || {};
      const results = Object.entries(fullData).map(([_, item]) => ({
        ...item,
        id: item.question_id,  // 👈 Make sure `id` exists for selection
      }));

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

  const handleSelect = async (result) => {
    if (!result?.id) {
      console.error("❌ Missing question ID in selected result");
      return;
    }

    setSelectedResult(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsEditing(false);
    setCustomApproach(''); // Reset before fetching

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/approach/get?question_id=${result.id}&user_id=${userId}`);
      const data = await res.json();
      setCustomApproach(data.custom_approach || '');
    } catch (err) {
      console.error("Error loading custom approach:", err);
    }
  };

  const handleBack = () => {
    setSelectedResult(null);
    setMatchedQuestions(cachedResults);
  };

  const handleSaveApproach = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/save-approach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          question_id: selectedResult.id,
          custom_approach: customApproach,
        }),
      });

      if (response.ok) {
        alert("Saved successfully!");
        setIsEditing(false);
      } else {
        alert("Failed to save.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
      
      {/* Sidebar Toggle Button - Fixed on Top Left */}
      <div className="flex h-screen bg-gray-900 text-white relative">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-50 bg-gray-800 text-white px-3 py-2 rounded shadow hover:bg-gray-700 focus:outline-none"
        >
          {sidebarOpen ? '≡' : '≡'}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed sm:relative z-40 ${sidebarOpen ? 'w-60' : 'w-0'} transition-all duration-300 bg-gray-800 h-screen overflow-y-auto`}
      >
        <div className="p-4 flex flex-col h-full justify-between">
          {sidebarOpen && (
            <>
              <select
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full mt-12 p-2 bg-gray-700 text-white rounded"
                defaultValue=""
              >
                <option value="" disabled>Select a level</option>
                {Object.keys(courseSubjects).map((course, idx) => (
                  <option key={idx} value={course}>{course}</option>
                ))}
              </select>

              <div className="space-y-2 mt-2">
                {selectedCourse && (
                  <div className="mt-4 space-y-2">
                    {courseSubjects[selectedCourse].map((subject, idx) => (
                      <div
                        key={idx}
                        className="text-sm hover:bg-gray-700 p-2 rounded cursor-pointer"
                        onClick={() => {
                          console.log("Selected subject:", subject);
                          // Optionally trigger filtering or search
                        }}
                      >
                        {subject}
                      </div>
                    ))}
                  </div>
                )}
              
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

        {loading && (
          <div className="flex flex-col items-center mt-12 text-gray-300 text-sm animate-pulse">
            <svg className="h-8 w-8 mb-2 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Searching...
         </div>
        )}

        {noResults && (
          <div className="flex flex-col items-center mt-12 text-red-400 text-sm">
            <svg className="h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No results found. Try refining your query.
          </div>
        )}
        
        {!selectedResult && matchedQuestions.length > 0 && (
          <div className="mt-2 w-full max-w-3xl space-y-4 px-2 sm:px-0">
            <h2 className="text-xl font-bold mb-4 text-white">Matched Questions</h2>

            {matchedQuestions.map((res, index) => (
              <div
                key={index}
                onClick={() => handleSelect(res)}
                className="bg-white text-black p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
              >
                <div className="text-sm text-gray-600 mb-1">Question {index + 1}</div>
                <div className="font-medium text-base">
                  {res.question?.length > 0
                    ? res.question.slice(0, 80) + (res.question.length > 80 ? "..." : "")
                    : "No question text"}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedResult && (
          <div className="mt-6 w-full max-w-4xl bg-gray-800 text-white px-8 pt-6 pb-4 rounded-2xl shadow-md space-y-6">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-600"
            >
              ← Back to Results
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-300">
              <div><span className="font-semibold">Chapter:</span> {selectedResult.chapter || "N/A"}</div>
              <div><span className="font-semibold">Source:</span> {selectedResult.sourceDetails || "N/A"}</div>
              <div><span className="font-semibold">Concept:</span> {selectedResult.conceptTested || "N/A"}</div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-white">📘 Concept Summary</h3>
              <article
                className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                dangerouslySetInnerHTML={{ __html: selectedResult.conceptSummary }}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-white">📝 Question</h3>
              <article
                className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                dangerouslySetInnerHTML={{ __html: selectedResult.question }}
              />
            </div>

            <div>
              <h3 className="text-lg font-bold mb-1 text-white">✅ Answer</h3>
              <article
                className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                dangerouslySetInnerHTML={{ __html: selectedResult.answer }}
              />
            </div>

            
            <div>
              <h3 className="text-lg font-bold mb-1 text-white">💡 How to Approach</h3>

              {isEditing ? (
                <>
                  <textarea
                    value={customApproach || selectedResult.howToApproach}
                    onChange={(e) => setCustomApproach(e.target.value)}
                    className="w-full p-3 rounded text-black text-sm bg-white border border-gray-300"
                    rows={6}
                  />
                  <button
                    onClick={handleSaveApproach}
                    className="mt-2 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <article
                    className="prose prose-slate max-w-none whitespace-pre-wrap text-white text-justify"
                    dangerouslySetInnerHTML={{
                      __html: customApproach || selectedResult.howToApproach,
                    }}
                  />
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Fixed Bottom Search Bar */}
      <div className={`fixed bottom-0 right-0 bg-gray-900 p-4 border-t border-gray-700 z-40 transition-all duration-300 ${sidebarOpen ? 'ml-60 w-[calc(100%-15rem)]'  : 'ml-0 w-full'}`}>
        <div className="w-full max-w-3xl flex mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by keyword, chapter, or question type..."
            className="flex-grow pl-10 pr-4 py-2 text-sm sm:text-base text-black rounded-l-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSearch()}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
    </div> 
     
  );
};

export default App;
