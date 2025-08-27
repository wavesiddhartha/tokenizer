"use client";

import React, { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Copy, Trash2 } from "lucide-react";
import { debounce } from "@/lib/utils";

interface TextInputProps {
  onTextChange: (text: string) => void;
  placeholder?: string;
}

export default function TextInput({ onTextChange, placeholder }: TextInputProps) {
  const [text, setText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  const debouncedOnTextChange = useCallback(
    debounce((newText: string) => {
      onTextChange(newText);
    }, 300),
    [onTextChange]
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Update statistics
    setCharCount(newText.length);
    setWordCount(newText.trim() ? newText.trim().split(/\s+/).length : 0);
    setLineCount(newText.split('\n').length);
    
    // Debounced callback to parent
    debouncedOnTextChange(newText);
  };

  const handleClear = () => {
    setText("");
    setCharCount(0);
    setWordCount(0);
    setLineCount(1);
    onTextChange("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
        setCharCount(content.length);
        setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0);
        setLineCount(content.split('\n').length);
        onTextChange(content);
      };
      reader.readAsText(file);
    }
    // Reset input
    e.target.value = "";
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "text-analysis.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Text Input
          </CardTitle>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".txt,.md,.json,.csv,.xml"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Upload File
            </Button>
          </div>
        </div>
        
        {/* Statistics */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary">{charCount} characters</Badge>
          <Badge variant="secondary">{wordCount} words</Badge>
          <Badge variant="secondary">{lineCount} lines</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={handleTextChange}
            placeholder={placeholder || "Enter your text here to analyze tokenization across AI models..."}
            className="min-h-[300px] resize-y"
            style={{ 
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
              fontSize: "14px",
              lineHeight: "1.5"
            }}
          />
          
          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!text}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!text}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              {!text && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const sampleText = "Hello world! This is a sample text to demonstrate token visualization. You can see how different AI models like GPT-4o, Claude 3.5 Sonnet, and Gemini Pro tokenize this text differently.";
                    setText(sampleText);
                    setCharCount(sampleText.length);
                    setWordCount(sampleText.trim().split(/\s+/).length);
                    setLineCount(sampleText.split('\n').length);
                    onTextChange(sampleText);
                  }}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Try Sample
                </Button>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={!text}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}