"use client";

import React, { useState, useRef, useMemo } from "react";
import HeroSection from "@/components/HeroSection";
import TextInput from "@/components/TextInput";
import TokenizerSection from "@/components/TokenizerSection";
import ConversionSection from "@/components/ConversionSection";
import ChartsSection from "@/components/ChartsSection";
import AdvancedAnalysis from "@/components/AdvancedAnalysis";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  Github, 
  Twitter, 
  Coffee, 
  Download,
  Share2,
  FileText,
  BarChart3,
  Zap,
  Star,
  Award,
  TrendingUp,
  Clock
} from "lucide-react";
import { tokenizeAllModels } from "@/lib/tokenizer";
import { exportToCSV, exportToJSON, exportToMarkdown, exportToPDF, shareViaWebAPI } from "@/lib/export-utils";

export default function Home() {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState<"tokenizer" | "conversion" | "analytics" | "advanced">("tokenizer");
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);
  const analyzerRef = useRef<HTMLDivElement>(null);
  
  // Advanced analytics computed from text with performance tracking
  const analytics = useMemo(() => {
    if (!text.trim()) return null;
    
    setIsAnalyzing(true);
    const startTime = performance.now();
    
    const results = tokenizeAllModels(text);
    const totalCost = results.reduce((sum, r) => sum + r.inputCost + r.outputCost, 0);
    const avgTokens = results.reduce((sum, r) => sum + r.tokenCount, 0) / results.length;
    const cheapest = results.reduce((min, r) => (r.inputCost + r.outputCost) < (min.inputCost + min.outputCost) ? r : min);
    const mostEfficient = results.reduce((min, r) => r.tokenCount < min.tokenCount ? r : min);
    
    const endTime = performance.now();
    const analysisTime = endTime - startTime;
    setLastAnalysisTime(analysisTime);
    setIsAnalyzing(false);
    
    return {
      results,
      totalCost,
      avgTokens,
      cheapest,
      mostEfficient,
      characterCount: text.length,
      wordCount: text.trim().split(/\s+/).length,
      modelCount: results.length,
      analysisTime
    };
  }, [text]);

  const scrollToAnalyzer = () => {
    analyzerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handleExport = (format: 'csv' | 'json' | 'markdown' | 'pdf') => {
    if (!analytics) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      textSample: text.length > 500 ? text.substring(0, 500) + '...' : text,
      tokenization: analytics.results,
      metadata: {
        version: '1.0.0',
        userAgent: navigator.userAgent,
        exportFormat: format
      }
    };
    
    switch (format) {
      case 'csv':
        exportToCSV(analytics.results, 'textanalyzer-results');
        break;
      case 'json':
        exportToJSON(exportData, 'textanalyzer-analysis');
        break;
      case 'markdown':
        exportToMarkdown(analytics.results, text, 'textanalyzer-report');
        break;
      case 'pdf':
        exportToPDF(analytics.results, text, 'textanalyzer-report');
        break;
    }
  };
  
  const handleShare = () => {
    if (!analytics) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      textSample: text.length > 200 ? text.substring(0, 200) + '...' : text,
      tokenization: analytics.results,
      metadata: {
        version: '1.0.0',
        userAgent: navigator.userAgent,
        exportFormat: 'share'
      }
    };
    
    shareViaWebAPI(exportData);
  };

  const tabs = [
    { id: "tokenizer" as const, label: "Token Analysis", description: "Compare models & costs" },
    { id: "advanced" as const, label: "Advanced Analysis", description: "Binary, hex, Unicode" },
    { id: "conversion" as const, label: "Text Conversion", description: "Format transformation" },
    { id: "analytics" as const, label: "Analytics", description: "Insights & charts" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection onScrollToAnalyzer={scrollToAnalyzer} />

      {/* Main Content */}
      <div ref={analyzerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Text Input */}
        <section>
          <TextInput 
            onTextChange={setText}
            placeholder="Paste your text here to analyze tokenization across AI models, estimate costs, and convert to different formats..."
          />
        </section>
        
        {/* Live Analytics Dashboard - Shows only when text is present */}
        {analytics && (
          <section className="animate-in slide-in-from-bottom-4 duration-500">
            <Card className="glass-morphism border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    Live Analysis Dashboard
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowExportPanel(!showExportPanel)}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Character Count */}
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analytics.characterCount.toLocaleString()}</div>
                    <div className="text-xs text-blue-700 font-medium">Characters</div>
                  </div>
                  
                  {/* Word Count */}
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analytics.wordCount.toLocaleString()}</div>
                    <div className="text-xs text-green-700 font-medium">Words</div>
                  </div>
                  
                  {/* Average Tokens */}
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(analytics.avgTokens).toLocaleString()}</div>
                    <div className="text-xs text-purple-700 font-medium">Avg Tokens</div>
                  </div>
                  
                  {/* Models Analyzed */}
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{analytics.modelCount}</div>
                    <div className="text-xs text-orange-700 font-medium">Models</div>
                  </div>
                  
                  {/* Best Value */}
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg relative">
                    <Award className="h-4 w-4 absolute top-1 right-1 text-yellow-500" />
                    <div className="text-2xl font-bold text-yellow-600">
                      ${((analytics.cheapest.inputCost + analytics.cheapest.outputCost) * 1000).toFixed(2)}
                    </div>
                    <div className="text-xs text-yellow-700 font-medium">Best $/1K</div>
                  </div>
                  
                  {/* Most Efficient */}
                  <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg relative">
                    <Zap className="h-4 w-4 absolute top-1 right-1 text-teal-500" />
                    <div className="text-2xl font-bold text-teal-600">{analytics.mostEfficient.tokenCount}</div>
                    <div className="text-xs text-teal-700 font-medium">Min Tokens</div>
                  </div>
                </div>
                
                {/* Export Panel */}
                {showExportPanel && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border animate-in slide-in-from-top-2">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Export Options
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        CSV Data
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('json')}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('markdown')}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Markdown
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('pdf')}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        PDF Report
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Navigation Tabs */}
        <section>
          <div className="flex flex-col sm:flex-row gap-2 mb-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="flex-1 h-auto py-4 px-6 flex flex-col items-center gap-1"
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="font-semibold">{tab.label}</span>
                <span className="text-xs opacity-75">{tab.description}</span>
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px] relative">
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <LoadingSpinner size="lg" text="Analyzing across all AI models..." type="pulse" />
              </div>
            )}
            
            <div className={`transition-opacity duration-300 ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}>
              {activeTab === "tokenizer" && <TokenizerSection text={text} />}
              {activeTab === "advanced" && <AdvancedAnalysis text={text} />}
              {activeTab === "conversion" && <ConversionSection text={text} />}
              {activeTab === "analytics" && <ChartsSection text={text} />}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold gradient-text">TextAnalyzer</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Professional AI text analysis platform for developers, researchers, 
                and content creators. Compare tokenization across 18+ AI models.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h4 className="font-semibold">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time tokenization analysis</li>
                <li>• TikTokenizer-style visualization</li>
                <li>• Binary, hex, Unicode analysis</li>
                <li>• Character frequency statistics</li>
                <li>• Multi-format conversion & export</li>
              </ul>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="font-semibold">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Coffee className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Built with Next.js, TypeScript, and Tailwind CSS
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200">
            <p className="text-xs text-muted-foreground">
              © 2024 TextAnalyzer. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Privacy-first • No data storage • Open source
            </p>
          </div>
        </div>
      </footer>

      {/* Enhanced Floating Action Buttons */}
      {text && (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
          {/* Export Quick Actions */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full shadow-xl bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400"
              onClick={() => analytics && exportToCSV(analytics.results)}
              title="Quick Export CSV"
            >
              <Download className="h-5 w-5 text-blue-600" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full shadow-xl bg-white hover:bg-green-50 border-2 border-green-200 hover:border-green-400"
              onClick={handleShare}
              title="Share Analysis"
            >
              <Share2 className="h-5 w-5 text-green-600" />
            </Button>
          </div>
          
          {/* Scroll to Top */}
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shadow-premium-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={scrollToTop}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
          
          {/* Performance Monitor */}
          {analytics && (
            <PerformanceMonitor 
              tokenizationTime={lastAnalysisTime}
              tokenCount={Math.round(analytics.avgTokens)}
              textLength={analytics.characterCount}
            />
          )}
        </div>
      )}
    </div>
  );
}
