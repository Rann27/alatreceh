"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TxtCombinerPage() {
  const [content, setContent] = useState("");
  const [glossary, setGlossary] = useState("");
  const [output, setOutput] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const combined = `=separator=
${content}
=separator=
${glossary}
=separator=`;
    setOutput(combined);
  }, [content, glossary]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col overflow-hidden">
      {/* Compact Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
        <div className="max-w-[98%] mx-auto px-4 py-2 flex items-center gap-4">
          <Link 
            href="/" 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
          >
            ← Kembali
          </Link>
          <div className="border-l border-gray-300 dark:border-gray-600 h-4"></div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              🔗 TxtCombiner
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Gabungkan chapter content & glossary dengan template separator
            </p>
          </div>
        </div>
      </header>

      {/* Copy Button Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="max-w-[98%] mx-auto px-4 py-2">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold text-sm shadow-sm"
            title="Salin output ke clipboard"
          >
            {copySuccess ? "✅ Output Tersalin!" : "📋 Copy Output"}
          </button>
        </div>
      </div>

      {/* Main Content - Full Height */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-[98%] mx-auto px-4 py-2">
          <div className="grid grid-cols-3 gap-3 h-full">
            {/* Content Column */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2 flex-shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste atau ketik chapter content di sini..."
                className="flex-1 w-full h-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-auto"
                spellCheck={false}
              />
            </div>

            {/* Glossary Column */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2 flex-shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                Glossary
              </label>
              <textarea
                value={glossary}
                onChange={(e) => setGlossary(e.target.value)}
                placeholder="Paste atau ketik glossary di sini..."
                className="flex-1 w-full h-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent overflow-auto"
                spellCheck={false}
              />
            </div>

            {/* Output Column */}
            <div className="flex flex-col h-full">
              <label className="text-xs font-semibold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2 flex-shrink-0">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                Output
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  (auto-generated)
                </span>
              </label>
              <textarea
                value={output}
                readOnly
                placeholder="Output akan muncul otomatis di sini..."
                className="flex-1 w-full h-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs resize-none focus:outline-none cursor-default overflow-auto"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="max-w-[98%] mx-auto px-4 py-1.5">
          <p className="text-center text-gray-600 dark:text-gray-400 text-xs">
            💡 Output otomatis ter-update setiap kali Anda mengetik
          </p>
        </div>
      </footer>
    </div>
  );
}
