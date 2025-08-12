import React from 'react';

export default function QuestionDetail({
  selectedResult,
  isEditing,
  customApproach,
  onBack,
  onEditToggle,
  onChangeApproach,
  onSaveApproach,
}) {
  return (
    <div className="mt-6 w-full max-w-4xl bg-gray-800 text-white px-8 pt-6 pb-4 rounded-2xl shadow-md space-y-6">
      <button
        onClick={onBack}
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
              onChange={(e) => onChangeApproach(e.target.value)}
              className="w-full p-3 rounded text-black text-sm bg-white border border-gray-300"
              rows={6}
            />
            <button
              onClick={onSaveApproach}
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
              onClick={onEditToggle}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}