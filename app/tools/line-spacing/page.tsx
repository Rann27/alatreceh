"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/app/components/ToolLayout";

type ModeType = "lf" | "word" | "custom";
type ActionType = "double" | "halve";

export default function LineSpacingPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ModeType>("lf");
  const [action, setAction] = useState<ActionType>("double");
  const [customToken, setCustomToken] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [newlineStyle, setNewlineStyle] = useState("—");
  const [copySuccess, setCopySuccess] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  function detectNewlineStyle(text: string) {
    const hasCRLF = text.includes("\r\n");
    const hasLF = text.includes("\n");
    if (hasCRLF) {
      return { style: "CRLF (Windows)", nl: "\r\n", re: /\r\n/g };
    } else if (hasLF) {
      return { style: "LF (Unix/macOS/Linux)", nl: "\n", re: /\n/g };
    } else {
      return { style: "—", nl: "\n", re: /\n/g };
    }
  }

  function replaceAllLiteral(haystack: string, needle: string, replacement: string) {
    if (!needle) return haystack;
    return haystack.split(needle).join(replacement);
  }

  useEffect(() => {
    const text = input;
    let out = text;
    let count = 0;

    if (mode === "lf") {
      const info = detectNewlineStyle(text);
      setNewlineStyle(info.style);
      if (text.length) {
        const matches = text.match(info.re);
        count = matches ? matches.length : 0;
        
        if (action === "double") {
          out = text.replace(info.re, info.nl + info.nl);
        } else {
          // Halve: replace double newlines with single
          const doubleNL = info.nl + info.nl;
          out = replaceAllLiteral(text, doubleNL, info.nl);
          // Count how many doubles were replaced
          const doubles = text.split(doubleNL).length - 1;
          count = doubles;
        }
      }
    } else if (mode === "word") {
      setNewlineStyle("—");
      if (text.length) {
        if (action === "double") {
          const m = text.match(/\^p/g);
          count = m ? m.length : 0;
          out = replaceAllLiteral(text, "^p", "^p^p");
        } else {
          const m = text.match(/\^p\^p/g);
          count = m ? m.length : 0;
          out = replaceAllLiteral(text, "^p^p", "^p");
        }
      }
    } else if (mode === "custom") {
      setNewlineStyle("—");
      const token = customToken;
      if (token && text.length) {
        if (action === "double") {
          const parts = text.split(token);
          count = parts.length > 1 ? parts.length - 1 : 0;
          out = parts.join(token + token);
        } else {
          const doubleToken = token + token;
          const parts = text.split(doubleToken);
          count = parts.length > 1 ? parts.length - 1 : 0;
          out = parts.join(token);
        }
      } else {
        count = 0;
        out = text;
      }
    }

    setOutput(out);
    setMatchCount(count);
  }, [input, mode, action, customToken]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setPasteSuccess(true);
      setTimeout(() => setPasteSuccess(false), 1200);
    } catch {
      setPasteSuccess(false);
      alert("Tidak bisa mengakses clipboard. Pastikan browser memiliki izin.");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setMatchCount(0);
    setNewlineStyle("—");
  };

  return (
    <ToolLayout
      title="📏 Line Spacing Tool"
      description="Gandakan atau kurangi spacing antar baris dengan mudah"
    >
      <div className="space-y-6">
        {/* Configuration Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Pilih Aksi & Mode:
            </h3>
            
            {/* Action Selection */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                Aksi:
              </div>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="action"
                    value="double"
                    checked={action === "double"}
                    onChange={(e) => setAction(e.target.value as ActionType)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900 dark:text-white">
                    🔼 Gandakan (1 → 2)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="action"
                    value="halve"
                    checked={action === "halve"}
                    onChange={(e) => setAction(e.target.value as ActionType)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-900 dark:text-white">
                    🔽 Kurangi (2 → 1)
                  </span>
                </label>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                Mode:
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="lf"
                  checked={mode === "lf"}
                  onChange={(e) => setMode(e.target.value as ModeType)}
                  className="w-4 h-4 mt-0.5"
                />
                <div>
                  <span className="text-gray-900 dark:text-white">
                    Newline (<code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">\n</code> atau{" "}
                    <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">\r\n</code>)
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Auto-detect Windows (CRLF) atau Unix (LF)
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="word"
                  checked={mode === "word"}
                  onChange={(e) => setMode(e.target.value as ModeType)}
                  className="w-4 h-4 mt-0.5"
                />
                <div>
                  <span className="text-gray-900 dark:text-white">
                    MS Word (<code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">^p</code>)
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Untuk teks dari MS Word
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="custom"
                  checked={mode === "custom"}
                  onChange={(e) => setMode(e.target.value as ModeType)}
                  className="w-4 h-4 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white">Token Kustom</span>
                  <input
                    type="text"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    disabled={mode !== "custom"}
                    placeholder="contoh: <br> atau ||"
                    className="mt-2 w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Input</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePaste}
                  className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  title="Tempel dari clipboard"
                >
                  {pasteSuccess ? "✅ Ditempel" : "📥 Tempel"}
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  title="Bersihkan semua"
                >
                  🧹 Bersihkan
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tempel atau ketik teks di sini..."
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Output{" "}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                  ({matchCount} {action === "double" ? "penggandaan" : "pengurangan"})
                </span>
              </h3>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                title="Salin ke clipboard"
              >
                {copySuccess ? "✅ Disalin" : "📋 Salin"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Hasil akan muncul otomatis di sini..."
              className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-y focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Info Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full">
              Deteksi newline: {newlineStyle}
            </span>
          </div>
          <div className="text-xs opacity-75">
            💡 Tip: Mode "Kurangi" akan mengubah spacing ganda menjadi single
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
