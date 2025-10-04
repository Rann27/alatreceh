"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/app/components/ToolLayout";

type BorderStyle = "single" | "double";
type WrapMode = "normal" | "hard" | "cjk";
type SpaceChar = "nbsp" | "space";
type BoxMode = "full" | "no-right";

const BORDERS = {
  single: { tl: '┌', tr: '┐', bl: '└', br: '┘', h: '─', v: '│' },
  double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
};

export default function BorderWrapperPage() {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState("");
  const [maxWidth, setMaxWidth] = useState(60);
  const [padTop, setPadTop] = useState(0);
  const [padRight, setPadRight] = useState(2);
  const [padBottom, setPadBottom] = useState(0);
  const [padLeft, setPadLeft] = useState(2);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>("double");
  const [wrapMode, setWrapMode] = useState<WrapMode>("normal");
  const [spaceChar, setSpaceChar] = useState<SpaceChar>("nbsp");
  const [boxMode, setBoxMode] = useState<BoxMode>("full");
  const [trimLines, setTrimLines] = useState(true);
  const [collapseBlank, setCollapseBlank] = useState(false);
  const [ambigWide, setAmbigWide] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Character width detection
  function isAmbiguousWide(code: number): boolean {
    return (
      (code >= 0x2190 && code <= 0x21FF) || // arrows
      (code >= 0x25A0 && code <= 0x25FF) || // geometric shapes
      (code >= 0x2700 && code <= 0x27BF) || // dingbats
      (code >= 0x1F300 && code <= 0x1FAFF)  // emoji blocks
    );
  }

  function isCJKWide(code: number): boolean {
    return (
      (code >= 0x1100 && code <= 0x115F) ||
      (code >= 0x2E80 && code <= 0xA4CF) ||
      (code >= 0xAC00 && code <= 0xD7A3) ||
      (code >= 0xF900 && code <= 0xFAFF) ||
      (code >= 0xFE10 && code <= 0xFE19) ||
      (code >= 0xFE30 && code <= 0xFE6F) ||
      (code >= 0xFF00 && code <= 0xFF60) ||
      (code >= 0xFFE0 && code <= 0xFFE6)
    );
  }

  function charWidth(ch: string, mode: WrapMode, ambigAsWide: boolean): number {
    const code = ch.codePointAt(0) || 0;
    if (mode === 'cjk' && isCJKWide(code)) return 2;
    if (ambigAsWide && isAmbiguousWide(code)) return 2;
    return 1;
  }

  function strDisplayWidth(s: string, mode: WrapMode, ambigAsWide: boolean): number {
    let w = 0;
    for (const ch of [...s]) w += charWidth(ch, mode, ambigAsWide);
    return w;
  }

  const repeat = (ch: string, n: number) => ch.repeat(Math.max(0, n));
  const makeSpaces = (n: number, type: SpaceChar) => 
    (type === 'nbsp' ? repeat('\u00A0', n) : repeat(' ', n));

  function wrapParagraph(text: string, width: number, mode: WrapMode, wMode: WrapMode, ambigAsWide: boolean): string[] {
    const lines: string[] = [];
    
    if (wMode === 'hard') {
      let buf = '', w = 0;
      for (const ch of [...text]) {
        const cw = charWidth(ch, mode, ambigAsWide);
        if (w + cw > width) { lines.push(buf); buf = ch; w = cw; }
        else { buf += ch; w += cw; }
      }
      if (buf) lines.push(buf);
      if (lines.length === 0) lines.push('');
      return lines;
    }

    const words: string[] = [];
    let cur = '';
    for (const ch of [...text]) {
      if (/\s/.test(ch) && ch !== '\u00A0') {
        if (cur) words.push(cur);
        cur = '';
        words.push(ch);
      } else {
        cur += ch;
      }
    }
    if (cur) words.push(cur);

    let line = '', lw = 0;
    const pushLine = () => { lines.push(line); line = ''; lw = 0; };
    
    function pushWord(word: string) {
      const ww = strDisplayWidth(word, mode, ambigAsWide);
      if (ww > width) {
        let part = '', pw = 0;
        for (const ch of [...word]) {
          const cw = charWidth(ch, mode, ambigAsWide);
          if (pw + cw > width) { lines.push(part); part = ch; pw = cw; }
          else { part += ch; pw += cw; }
        }
        if (part) {
          if (lw === 0) { line = part; lw = pw; }
          else { lines.push(line); line = part; lw = pw; }
        }
      } else {
        if (lw + ww > width) pushLine();
        line += word; lw += ww;
      }
    }

    for (const w of words) {
      if (/\s/.test(w) && w !== '\u00A0') {
        if (line && lw < width) pushWord(' ');
      } else {
        pushWord(w);
      }
    }
    if (line || lines.length === 0) pushLine();
    return lines;
  }

  function buildBox(text: string): string {
    const chars = BORDERS[borderStyle];
    const space = (n: number) => makeSpaces(n, spaceChar);
    const mode = (wrapMode === 'cjk') ? 'cjk' : 'normal';
    
    // Calculate content width (text area without borders and padding)
    // maxWidth includes: left_border + left_padding + content + right_padding + right_border
    let contentWidth: number;
    if (boxMode === 'full') {
      // Full box: 1 (left border) + padLeft + content + padRight + 1 (right border) = maxWidth
      contentWidth = maxWidth - 2 - padLeft - padRight;
    } else {
      // No right: 1 (left border) + padLeft + content + padRight = maxWidth
      contentWidth = maxWidth - 1 - padLeft - padRight;
    }
    const innerWidth = Math.max(1, contentWidth);

    let rawLines = (text || '').split(/\r?\n/);
    if (trimLines) rawLines = rawLines.map(s => s.trim());
    if (collapseBlank) {
      const tmp: string[] = [];
      let lastBlank = false;
      for (const s of rawLines) {
        const blank = s.trim().length === 0;
        if (blank && lastBlank) continue;
        tmp.push(s);
        lastBlank = blank;
      }
      rawLines = tmp;
    }

    const contentLines: string[] = [];
    for (let i = 0; i < padTop; i++) contentLines.push('');
    for (const line of rawLines) {
      const wrapped = wrapParagraph(line, innerWidth, mode, wrapMode, ambigWide);
      contentLines.push(...wrapped);
    }
    for (let i = 0; i < padBottom; i++) contentLines.push('');

    const boxed: string[] = [];
    
    if (boxMode === 'full') {
      // Full box mode
      // Top/bottom length = maxWidth - 2 (minus corner characters)
      const horizontalLength = maxWidth - 2;
      const top = chars.tl + repeat(chars.h, horizontalLength) + chars.tr;
      const bottom = chars.bl + repeat(chars.h, horizontalLength) + chars.br;
      
      boxed.push(top);
      for (const ln of contentLines) {
        // For each line, we need to ensure total content width = innerWidth
        // by padding with spaces after the text
        const textWidth = strDisplayWidth(ln, mode, ambigWide);
        const fillNeeded = innerWidth - textWidth;
        
        // Build line parts
        const leftPadding = space(padLeft);
        const content = ln;
        const filling = space(Math.max(0, fillNeeded));
        const rightPadding = space(padRight);
        
        // Assemble: │ + leftPad + content + fill + rightPad + │
        const lineStr = chars.v + leftPadding + content + filling + rightPadding + chars.v;
        boxed.push(lineStr);
      }
      if (contentLines.length === 0) {
        // Empty box: border + spaces to fill + border
        const emptyLineContent = space(padLeft) + space(innerWidth) + space(padRight);
        boxed.push(chars.v + emptyLineContent + chars.v);
      }
      boxed.push(bottom);
    } else {
      // No right border mode
      const top = chars.tl + repeat(chars.h, maxWidth - 1);
      const bottom = chars.bl + repeat(chars.h, maxWidth - 1);
      
      boxed.push(top);
      for (const ln of contentLines) {
        const dw = strDisplayWidth(ln, mode, ambigWide);
        const fill = Math.max(0, innerWidth - dw);
        const lineStr = chars.v + space(padLeft) + ln + space(fill) + space(padRight);
        boxed.push(lineStr);
      }
      if (contentLines.length === 0) {
        boxed.push(chars.v + space(maxWidth - 1));
      }
      boxed.push(bottom);
    }
    
    return boxed.join('\n');
  }

  useEffect(() => {
    const result = buildBox(inputText);
    setOutput(result);
  }, [inputText, maxWidth, padTop, padRight, padBottom, padLeft, borderStyle, wrapMode, spaceChar, boxMode, trimLines, collapseBlank, ambigWide]);

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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch {
      alert("Tidak bisa mengakses clipboard. Pastikan browser memiliki izin.");
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutput("");
  };

  return (
    <ToolLayout
      title="📦 Border Wrapper"
      description="Bungkus teks dengan ASCII box drawing characters"
    >
      <div className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Teks Sumber
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tempel atau ketik teks di sini..."
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
          <div className="flex gap-2">
            <button
              onClick={handlePaste}
              className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              📥 Tempel
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              🧹 Bersihkan
            </button>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Max Width */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Lebar Maksimal (kolom)
            </label>
            <input
              type="number"
              min="10"
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Total termasuk border & padding
            </span>
          </div>

          {/* Padding */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Padding (spasi)
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Top</span>
                <input
                  type="number"
                  min="0"
                  value={padTop}
                  onChange={(e) => setPadTop(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Right</span>
                <input
                  type="number"
                  min="0"
                  value={padRight}
                  onChange={(e) => setPadRight(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Bottom</span>
                <input
                  type="number"
                  min="0"
                  value={padBottom}
                  onChange={(e) => setPadBottom(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Left</span>
                <input
                  type="number"
                  min="0"
                  value={padLeft}
                  onChange={(e) => setPadLeft(Number(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Border Style */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Gaya Border
            </label>
            <select
              value={borderStyle}
              onChange={(e) => setBorderStyle(e.target.value as BorderStyle)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="single">Single (┌─┐│└┘)</option>
              <option value="double">Double (╔═╗║╚╝)</option>
            </select>
          </div>

          {/* Box Mode */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Mode Box
            </label>
            <select
              value={boxMode}
              onChange={(e) => setBoxMode(e.target.value as BoxMode)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="full">Full Box (dengan border kanan)</option>
              <option value="no-right">Without Right Border</option>
            </select>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {boxMode === 'no-right' && 'Tanpa border & corner kanan'}
            </span>
          </div>

          {/* Wrap Mode */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Wrap Mode
            </label>
            <select
              value={wrapMode}
              onChange={(e) => setWrapMode(e.target.value as WrapMode)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="normal">Normal (berdasar kata)</option>
              <option value="hard">Hard wrap (potong kata)</option>
              <option value="cjk">CJK 2-lebar (CN/JP/KR)</option>
            </select>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              CJK menjaga alignment huruf lebar ganda
            </span>
          </div>

          {/* Space Character */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              Spasi untuk padding/fill
            </label>
            <select
              value={spaceChar}
              onChange={(e) => setSpaceChar(e.target.value as SpaceChar)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="nbsp">NBSP (anti-trim)</option>
              <option value="space">Spasi biasa</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Pengaturan Tambahan
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-900 dark:text-white">
                Trim spasi berlebih per baris input
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={collapseBlank}
                onChange={(e) => setCollapseBlank(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-900 dark:text-white">
                Gabung blank line berturut-turut
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ambigWide}
                onChange={(e) => setAmbigWide(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-900 dark:text-white">
                Anggap simbol ambigu lebar 2 (▶, ◆, ➜, emoji)
              </span>
            </label>
          </div>
        </div>

        {/* Copy Button */}
        <div>
          <button
            onClick={handleCopy}
            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold"
          >
            {copySuccess ? "✅ Output Disalin!" : "📋 Salin Output"}
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Pratinjau (monospace) - Gunakan font monospace di terminal/editor untuk hasil terbaik
          </label>
          <pre className="w-full min-h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-auto overflow-y-auto font-mono text-sm leading-[1.3]" style={{ fontFamily: 'Consolas, "Courier New", monospace', letterSpacing: '0', whiteSpace: 'pre' }}>
            {output || "Output akan muncul di sini..."}
          </pre>
        </div>

        {/* Output Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Output Teks
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm leading-[1.3] resize-y"
            spellCheck={false}
            style={{ fontFamily: 'Consolas, "Courier New", monospace', letterSpacing: '0', whiteSpace: 'pre' }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
