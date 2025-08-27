"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileType, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertCircle,
  Code
} from "lucide-react";
import { 
  CONVERSION_FORMATS, 
  convertText 
} from "@/lib/converters";
import { cn } from "@/lib/utils";

interface ConversionSectionProps {
  text: string;
}

export default function ConversionSection({ text }: ConversionSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState("json");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const conversionResult = useMemo(() => {
    if (!text.trim()) return null;
    return convertText(text, selectedFormat);
  }, [text, selectedFormat]);

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
    const mimeTypes = {
      json: "application/json",
      xml: "application/xml",
      csv: "text/csv",
      markdown: "text/markdown",
      html: "text/html",
    };

    const extensions = {
      json: "json",
      xml: "xml",
      csv: "csv",
      markdown: "md",
      html: "html",
    };

    const mimeType = mimeTypes[format.toLowerCase() as keyof typeof mimeTypes] || "text/plain";
    const extension = extensions[format.toLowerCase() as keyof typeof extensions] || "txt";

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-text.${extension}`;
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
            <FileType className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Enter text to see conversion options</p>
            <p className="text-sm">Convert your text to various formats like JSON, XML, CSV, and more</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileType className="h-5 w-5" />
            Text Conversion
          </CardTitle>
          <div className="flex flex-wrap gap-2 pt-4">
            {CONVERSION_FORMATS.map((format) => (
              <Button
                key={format.id}
                variant={selectedFormat === format.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFormat(format.id)}
                className="flex items-center gap-2"
              >
                <Code className="h-4 w-4" />
                {format.name}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Conversion Result */}
      {conversionResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={conversionResult.success ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {conversionResult.success ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {conversionResult.format} {conversionResult.success ? "Conversion" : "Error"}
                </Badge>
                {conversionResult.success && (
                  <span className="text-sm text-muted-foreground">
                    {conversionResult.content.length.toLocaleString()} characters
                  </span>
                )}
              </div>

              {conversionResult.success && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(conversionResult.content, conversionResult.format)}
                    className="flex items-center gap-1"
                  >
                    {copySuccess === conversionResult.format ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copySuccess === conversionResult.format ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(conversionResult.content, conversionResult.format)}
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
            {conversionResult.success ? (
              <div className="space-y-4">
                <Textarea
                  value={conversionResult.content}
                  readOnly
                  className="min-h-[400px] font-mono text-sm resize-y"
                  style={{
                    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
                    fontSize: "13px",
                    lineHeight: "1.4"
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
                  <p className="text-sm font-medium">Conversion Failed</p>
                  <p className="text-xs text-muted-foreground">
                    {conversionResult.error || "Unknown error occurred"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Format Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Format Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONVERSION_FORMATS.map((format) => (
              <div
                key={format.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                  selectedFormat === format.id
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-4 w-4" />
                  <span className="font-semibold">{format.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}