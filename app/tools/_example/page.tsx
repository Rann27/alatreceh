"use client";

import { useState } from "react";
import ToolLayout from "@/app/components/ToolLayout";

export default function ExampleToolPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleProcess = () => {
    // Contoh processing - ganti dengan logika tool Anda
    setOutput(input.toUpperCase());
  };

  return (
    <ToolLayout 
      title="Example Tool" 
      description="Ini contoh template untuk membuat tool baru"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Input
          </h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Masukkan text di sini..."
            className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
          <button
            onClick={handleProcess}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Process
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Output
          </h2>
          <div className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white overflow-auto">
            {output || "Output akan muncul di sini..."}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              alert("Copied to clipboard!");
            }}
            disabled={!output}
            className="mt-4 w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Copy to Clipboard
          </button>
        </div>
      </div>

      {/* Instructions or Additional Info */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Cara Menggunakan:
        </h3>
        <ol className="text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside space-y-1">
          <li>Masukkan text di kolom input</li>
          <li>Klik tombol "Process"</li>
          <li>Hasil akan muncul di kolom output</li>
          <li>Klik "Copy to Clipboard" untuk menyalin hasil</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
