"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Binary, 
  Hash, 
  Database,
  Cpu,
  Download,
  Copy,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Zap,
  Eye,
  Code2
} from "lucide-react";
import { 
  ENCODING_FORMATS,
  encodeText,
  analyzeCharacters,
  calculateTextStatistics,
  EncodingResult,
  CharacterAnalysis,
  TextStatistics
} from "@/lib/encodings";
import { cn } from "@/lib/utils";

interface AdvancedAnalysisProps {
  text: string;
}

export default function AdvancedAnalysis({ text }: AdvancedAnalysisProps) {
  const [selectedEncoding, setSelectedEncoding] = useState("binary");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"encodings" | "analysis" | "characters">("encodings");

  const encodingResult = useMemo(() => {
    if (!text.trim()) return null;
    return encodeText(text, selectedEncoding);
  }, [text, selectedEncoding]);

  const characterAnalysis = useMemo(() => {
    if (!text.trim()) return [];
    return analyzeCharacters(text);
  }, [text]);

  const textStats = useMemo(() => {
    if (!text.trim()) return null;
    return calculateTextStatistics(text);
  }, [text]);

  const handleCopy = async (content: string, format: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess(format);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = (content: string, format: string) => {
    const extensions: { [key: string]: string } = {
      binary: "bin",
      hex: "hex", 
      hexadecimal: "hex",
      base64: "b64",
      ascii: "txt",
      unicode: "txt",
      octal: "oct",
      hexdump: "hex"
    };

    const extension = extensions[format.toLowerCase()] || "txt";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `encoded-${format.toLowerCase()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!text.trim()) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Binary className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Enter text to see advanced analysis</p>
            <p className="text-sm">Binary, ASCII, hex dump, Unicode analysis and more</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Advanced Text Analysis
          </CardTitle>
          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              variant={activeView === "encodings" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("encodings")}
              className="flex items-center gap-2"
            >
              <Code2 className="h-4 w-4" />
              Encodings
            </Button>
            <Button
              variant={activeView === "analysis" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("analysis")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Statistics
            </Button>
            <Button
              variant={activeView === "characters" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("characters")}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Characters
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Encodings View */}
      {activeView === "encodings" && (
        <div className="space-y-6">
          {/* Format Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Encoding Formats</CardTitle>
              <div className="flex flex-wrap gap-2 pt-4">
                {ENCODING_FORMATS.map((format) => (
                  <Button
                    key={format.id}
                    variant={selectedEncoding === format.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedEncoding(format.id)}
                    className="flex items-center gap-2"
                  >
                    {format.id === "binary" && <Binary className="h-4 w-4" />}
                    {format.id === "hex" && <Hash className="h-4 w-4" />}
                    {format.id === "base64" && <Database className="h-4 w-4" />}
                    {format.id === "ascii" && <Zap className="h-4 w-4" />}
                    {format.id === "unicode" && <Code2 className="h-4 w-4" />}
                    {format.id === "octal" && <Hash className="h-4 w-4" />}
                    {format.id === "hexdump" && <Binary className="h-4 w-4" />}
                    {format.name}
                  </Button>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Encoding Result */}
          {encodingResult && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={encodingResult.success ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {encodingResult.success ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {encodingResult.format}
                    </Badge>
                    {encodingResult.success && (
                      <span className="text-sm text-muted-foreground">
                        {encodingResult.bytes} bytes
                      </span>
                    )}
                  </div>

                  {encodingResult.success && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(encodingResult.content, encodingResult.format)}
                        className="flex items-center gap-1"
                      >
                        {copySuccess === encodingResult.format ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copySuccess === encodingResult.format ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(encodingResult.content, encodingResult.format)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {encodingResult.success ? (
                  <Textarea
                    value={encodingResult.content}
                    readOnly
                    className="min-h-[300px] font-mono text-sm resize-y"
                    style={{
                      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                      fontSize: "12px",
                      lineHeight: selectedEncoding === "hexdump" ? "1.2" : "1.4"
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-2">
                      <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                      <p className="text-sm font-medium">Encoding Failed</p>
                      <p className="text-xs text-muted-foreground">
                        {encodingResult.error || "Unknown error occurred"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Statistics View */}
      {activeView === "analysis" && textStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Basic Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Characters:</span>
                <span className="font-mono">{textStats.totalCharacters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unique Characters:</span>
                <span className="font-mono">{textStats.uniqueCharacters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Words:</span>
                <span className="font-mono">{textStats.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lines:</span>
                <span className="font-mono">{textStats.lines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sentences:</span>
                <span className="font-mono">{textStats.sentences}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paragraphs:</span>
                <span className="font-mono">{textStats.paragraphs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bytes (UTF-8):</span>
                <span className="font-mono">{textStats.bytes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entropy:</span>
                <span className="font-mono">{textStats.entropy.toFixed(3)} bits</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Characters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Most Frequent Characters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {textStats.topCharacters.map((char, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                        {char.char}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">{char.count}</div>
                      <div className="text-xs text-muted-foreground">
                        {char.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Text Composition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Word Length:</span>
                <span className="font-mono">
                  {textStats.words > 0 ? (textStats.totalCharacters / textStats.words).toFixed(1) : "0"} chars
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg. Line Length:</span>
                <span className="font-mono">
                  {textStats.lines > 0 ? (textStats.totalCharacters / textStats.lines).toFixed(1) : "0"} chars
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Character Diversity:</span>
                <span className="font-mono">
                  {textStats.totalCharacters > 0 ? 
                    ((textStats.uniqueCharacters / textStats.totalCharacters) * 100).toFixed(1) : "0"}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Compression Ratio:</span>
                <span className="font-mono">
                  {(textStats.entropy / 8 * 100).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Character Analysis View */}
      {activeView === "characters" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Character Analysis</CardTitle>
            <p className="text-sm text-muted-foreground">
              Detailed breakdown of all characters with Unicode, ASCII, binary, and hex values
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Char</th>
                    <th className="text-left p-2">Count</th>
                    <th className="text-left p-2">Unicode</th>
                    <th className="text-left p-2">Decimal</th>
                    <th className="text-left p-2">Hex</th>
                    <th className="text-left p-2">Binary</th>
                    <th className="text-left p-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {characterAnalysis.slice(0, 50).map((char, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {char.char}
                        </span>
                      </td>
                      <td className="p-2 font-mono">{char.frequency}</td>
                      <td className="p-2 font-mono text-blue-600">{char.unicode}</td>
                      <td className="p-2 font-mono">{char.decimal}</td>
                      <td className="p-2 font-mono text-green-600">{char.hex}</td>
                      <td className="p-2 font-mono text-purple-600 text-xs">{char.binary}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">
                          {char.category}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {characterAnalysis.length > 50 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Showing first 50 characters. Total: {characterAnalysis.length} unique characters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}