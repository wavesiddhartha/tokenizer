"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  DollarSign, 
  Clock, 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  Download,
  Eye,
  EyeOff
} from "lucide-react";
import { 
  AI_MODELS, 
  TokenizationResult, 
  tokenizeAllModels,
  AIModel
} from "@/lib/tokenizer";
import { formatPrice, formatNumber, cn } from "@/lib/utils";

interface TokenizerSectionProps {
  text: string;
}

const PROVIDER_COLORS = {
  "OpenAI": "bg-green-100 text-green-800 border-green-200",
  "Anthropic": "bg-blue-100 text-blue-800 border-blue-200",
  "Google": "bg-red-100 text-red-800 border-red-200",
  "Meta": "bg-purple-100 text-purple-800 border-purple-200",
  "Mistral": "bg-orange-100 text-orange-800 border-orange-200",
  "Cohere": "bg-teal-100 text-teal-800 border-teal-200",
};

export default function TokenizerSection({ text }: TokenizerSectionProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"tokens" | "inputCost" | "outputCost">("tokens");
  const [showTokenVisualization, setShowTokenVisualization] = useState(true);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [tokenColorMode, setTokenColorMode] = useState<"rainbow" | "semantic" | "length" | "frequency">("rainbow");
  const [showTokenBoundaries, setShowTokenBoundaries] = useState(true);
  const [tokenHoverInfo, setTokenHoverInfo] = useState<{ index: number; token: string } | null>(null);
  const [animateTokens, setAnimateTokens] = useState(true);

  const results = useMemo(() => {
    if (!text.trim()) return [];
    return tokenizeAllModels(text);
  }, [text]);

  const filteredResults = useMemo(() => {
    let filtered = results;
    
    if (selectedProvider !== "all") {
      filtered = filtered.filter(result => {
        const model = AI_MODELS.find(m => m.id === result.modelId);
        return model?.provider === selectedProvider;
      });
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "tokens":
          return a.tokenCount - b.tokenCount;
        case "inputCost":
          return a.inputCost - b.inputCost;
        case "outputCost":
          return a.outputCost - b.outputCost;
        default:
          return 0;
      }
    });
  }, [results, selectedProvider, sortBy]);

  const providers = Array.from(new Set(AI_MODELS.map(model => model.provider)));

  const getModel = (modelId: string): AIModel => {
    return AI_MODELS.find(m => m.id === modelId)!;
  };

  // Advanced Token visualization with multiple coloring modes
  const visualizeTokens = (text: string) => {
    if (!text) return [];
    
    const tokens = text.match(/\S+|\s+/g) || [];
    const tokenFreq: { [key: string]: number } = {};
    tokens.forEach(token => {
      if (!/^\s+$/.test(token)) {
        tokenFreq[token] = (tokenFreq[token] || 0) + 1;
      }
    });
    
    const rainbowColors = [
      'bg-red-100 border-red-300 text-red-900 hover:bg-red-200',
      'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200', 
      'bg-green-100 border-green-300 text-green-900 hover:bg-green-200',
      'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200',
      'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200',
      'bg-pink-100 border-pink-300 text-pink-900 hover:bg-pink-200',
      'bg-indigo-100 border-indigo-300 text-indigo-900 hover:bg-indigo-200',
      'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200',
      'bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200',
      'bg-cyan-100 border-cyan-300 text-cyan-900 hover:bg-cyan-200',
      'bg-lime-100 border-lime-300 text-lime-900 hover:bg-lime-200',
      'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
    ];
    
    const getSemanticColor = (token: string) => {
      if (/^[0-9]+$/.test(token)) return 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200';
      if (/^[A-Z][a-z]*$/.test(token)) return 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200';
      if (/^[a-z]+$/.test(token)) return 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200';
      if (/[!@#$%^&*(),.?":{}|<>]/.test(token)) return 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200';
      return 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200';
    };
    
    const getLengthColor = (length: number) => {
      if (length <= 2) return 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200';
      if (length <= 4) return 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200';
      if (length <= 6) return 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200';
      if (length <= 8) return 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200';
      return 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200';
    };
    
    const getFrequencyColor = (freq: number) => {
      if (freq === 1) return 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200';
      if (freq === 2) return 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200';
      if (freq === 3) return 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200';
      if (freq >= 4) return 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200';
      return 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200';
    };
    
    return tokens.map((token, index) => {
      let color = '';
      switch (tokenColorMode) {
        case 'rainbow':
          color = rainbowColors[index % rainbowColors.length];
          break;
        case 'semantic':
          color = getSemanticColor(token);
          break;
        case 'length':
          color = getLengthColor(token.length);
          break;
        case 'frequency':
          color = getFrequencyColor(tokenFreq[token] || 0);
          break;
      }
      
      return {
        text: token,
        color,
        isWhitespace: /^\s+$/.test(token),
        frequency: tokenFreq[token] || 0,
        length: token.length,
        semanticType: /^[0-9]+$/.test(token) ? 'number' : 
                     /^[A-Z][a-z]*$/.test(token) ? 'proper' :
                     /^[a-z]+$/.test(token) ? 'word' :
                     /[!@#$%^&*(),.?":{}|<>]/.test(token) ? 'punctuation' : 'other'
      };
    });
  };

  const visualTokens = visualizeTokens(text);

  const getCostTrend = (result: TokenizationResult): "up" | "down" | "neutral" => {
    const avgInputCost = results.reduce((sum, r) => sum + r.inputCost, 0) / results.length;
    const avgOutputCost = results.reduce((sum, r) => sum + r.outputCost, 0) / results.length;
    const avgTotal = avgInputCost + avgOutputCost;
    const resultTotal = result.inputCost + result.outputCost;
    
    if (resultTotal > avgTotal * 1.1) return "up";
    if (resultTotal < avgTotal * 0.9) return "down";
    return "neutral";
  };

  const exportResults = () => {
    const csvContent = [
      "Model,Provider,Tokens,Characters,Words,Input Cost,Output Cost,Total Cost",
      ...filteredResults.map(result => {
        const model = getModel(result.modelId);
        const totalCost = result.inputCost + result.outputCost;
        return `${model.name},${model.provider},${result.tokenCount},${result.characterCount},${result.wordsCount},${result.inputCost.toFixed(4)},${result.outputCost.toFixed(4)},${totalCost.toFixed(4)}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tokenization-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!text.trim()) {
    return (
      <div className="space-y-6">
        {/* Token Visualization Card - Empty State */}
        {showTokenVisualization && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Token Visualization
                </CardTitle>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showWhitespace}
                      onChange={(e) => setShowWhitespace(e.target.checked)}
                      className="rounded"
                      disabled
                    />
                    <span className="text-sm text-muted-foreground">Show whitespace</span>
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTokenVisualization(false)}
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg p-4 h-[200px] bg-gray-50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Enter text above to see colorful token visualization</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Each token will be color-coded for easy visualization when you enter text. Token counts may vary between different models.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show Token Visualization Button when hidden */}
        {!showTokenVisualization && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Button
                variant="outline"
                onClick={() => setShowTokenVisualization(true)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Show Token Visualization
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="w-full">
          <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Enter text to see tokenization results</p>
              <p className="text-sm">Compare token counts and costs across 18+ AI models</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Visualization Card */}
      {showTokenVisualization && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Token Visualization
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4">
                {/* Color Mode Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Color by:</span>
                  <select
                    value={tokenColorMode}
                    onChange={(e) => setTokenColorMode(e.target.value as "rainbow" | "semantic" | "length" | "frequency")}
                    className="text-sm border rounded px-2 py-1 bg-white"
                  >
                    <option value="rainbow">Rainbow</option>
                    <option value="semantic">Type</option>
                    <option value="length">Length</option>
                    <option value="frequency">Frequency</option>
                  </select>
                </div>
                
                {/* Whitespace Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWhitespace}
                    onChange={(e) => setShowWhitespace(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show whitespace</span>
                </label>
                
                {/* Boundaries Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTokenBoundaries}
                    onChange={(e) => setShowTokenBoundaries(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Token boundaries</span>
                </label>
                
                {/* Animation Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animateTokens}
                    onChange={(e) => setAnimateTokens(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Animations</span>
                </label>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTokenVisualization(false)}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg p-6 min-h-[250px] bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.02] bg-grid-pattern"></div>
              
              <div className="relative leading-relaxed">
                {visualTokens.map((token, index) => (
                  <span
                    key={index}
                    className={`inline-block border-2 rounded-lg px-3 py-2 m-1 text-sm font-medium cursor-pointer transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${
                      token.color
                    } ${
                      token.isWhitespace && !showWhitespace ? 'opacity-30' : ''
                    } ${
                      showTokenBoundaries ? 'border-dashed' : 'border-solid'
                    } ${
                      animateTokens ? 'hover:rotate-1' : ''
                    }`}
                    style={{
                      whiteSpace: showWhitespace ? 'pre' : 'normal',
                      animationDelay: animateTokens ? `${index * 50}ms` : undefined,
                      animation: animateTokens ? 'fadeInUp 0.3s ease-out forwards' : undefined
                    }}
                    onMouseEnter={() => setTokenHoverInfo({ index, token: token.text })}
                    onMouseLeave={() => setTokenHoverInfo(null)}
                    title={`Token #${index + 1}\nLength: ${token.length}\nFrequency: ${token.frequency}\nType: ${token.semanticType}`}
                  >
                    {token.isWhitespace && showWhitespace
                      ? token.text.replace(/ /g, '·').replace(/\n/g, '↵\n').replace(/\t/g, '→')
                      : token.text
                    }
                  </span>
                ))}
              </div>
              
              {/* Hover Info Overlay */}
              {tokenHoverInfo && (
                <div className="absolute top-4 right-4 bg-black text-white px-3 py-2 rounded-lg text-xs shadow-xl z-10">
                  <div>Token #{tokenHoverInfo.index + 1}</div>
                  <div>Length: {tokenHoverInfo.token.length}</div>
                </div>
              )}
            </div>
            <div className="mt-6 space-y-4">
              {/* Token Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-2xl font-bold text-blue-600">{visualTokens.length}</div>
                  <div className="text-xs text-muted-foreground">Total Tokens</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-2xl font-bold text-green-600">{visualTokens.filter(t => !t.isWhitespace).length}</div>
                  <div className="text-xs text-muted-foreground">Word Tokens</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-2xl font-bold text-orange-600">{visualTokens.filter(t => t.isWhitespace).length}</div>
                  <div className="text-xs text-muted-foreground">Whitespace</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="text-2xl font-bold text-purple-600">
                    {visualTokens.filter(t => !t.isWhitespace).reduce((sum, t) => sum + t.length, 0) / Math.max(visualTokens.filter(t => !t.isWhitespace).length, 1)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Length</div>
                </div>
              </div>
              
              {/* Color Legend */}
              {tokenColorMode !== 'rainbow' && (
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="text-sm font-semibold mb-2">Color Legend:</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {tokenColorMode === 'semantic' && (
                      <>
                        <span className="bg-blue-100 border border-blue-300 text-blue-900 px-2 py-1 rounded">Numbers</span>
                        <span className="bg-green-100 border border-green-300 text-green-900 px-2 py-1 rounded">Proper nouns</span>
                        <span className="bg-gray-100 border border-gray-300 text-gray-900 px-2 py-1 rounded">Words</span>
                        <span className="bg-red-100 border border-red-300 text-red-900 px-2 py-1 rounded">Punctuation</span>
                        <span className="bg-purple-100 border border-purple-300 text-purple-900 px-2 py-1 rounded">Other</span>
                      </>
                    )}
                    {tokenColorMode === 'length' && (
                      <>
                        <span className="bg-red-100 border border-red-300 text-red-900 px-2 py-1 rounded">1-2 chars</span>
                        <span className="bg-orange-100 border border-orange-300 text-orange-900 px-2 py-1 rounded">3-4 chars</span>
                        <span className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-2 py-1 rounded">5-6 chars</span>
                        <span className="bg-green-100 border border-green-300 text-green-900 px-2 py-1 rounded">7-8 chars</span>
                        <span className="bg-blue-100 border border-blue-300 text-blue-900 px-2 py-1 rounded">9+ chars</span>
                      </>
                    )}
                    {tokenColorMode === 'frequency' && (
                      <>
                        <span className="bg-gray-100 border border-gray-300 text-gray-900 px-2 py-1 rounded">Unique</span>
                        <span className="bg-blue-100 border border-blue-300 text-blue-900 px-2 py-1 rounded">2x</span>
                        <span className="bg-green-100 border border-green-300 text-green-900 px-2 py-1 rounded">3x</span>
                        <span className="bg-red-100 border border-red-300 text-red-900 px-2 py-1 rounded">4+ times</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p>Advanced token visualization with multiple coloring modes, hover interactions, and detailed statistics. Each token provides insights into length, frequency, and semantic type.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show Token Visualization Button when hidden */}
      {!showTokenVisualization && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Button
              variant="outline"
              onClick={() => setShowTokenVisualization(true)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Show Token Visualization
            </Button>
          </CardContent>
        </Card>
      )}
      {/* Header with filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Model Comparison ({filteredResults.length} models)
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={exportResults}
              disabled={filteredResults.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Provider:</span>
              <div className="flex gap-1">
                <Button
                  variant={selectedProvider === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvider("all")}
                >
                  All
                </Button>
                {providers.map(provider => (
                  <Button
                    key={provider}
                    variant={selectedProvider === provider ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedProvider(provider)}
                  >
                    {provider}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="flex gap-1">
                <Button
                  variant={sortBy === "tokens" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("tokens")}
                >
                  Tokens
                </Button>
                <Button
                  variant={sortBy === "inputCost" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("inputCost")}
                >
                  Input Cost
                </Button>
                <Button
                  variant={sortBy === "outputCost" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("outputCost")}
                >
                  Output Cost
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((result) => {
          const model = getModel(result.modelId);
          const trend = getCostTrend(result);
          const totalCost = result.inputCost + result.outputCost;
          
          return (
            <Card key={result.modelId} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "mt-1",
                        PROVIDER_COLORS[model.provider as keyof typeof PROVIDER_COLORS] || "bg-gray-100 text-gray-800"
                      )}
                    >
                      {model.provider}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    {trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                    {trend === "neutral" && <Minus className="h-4 w-4 text-gray-500" />}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Token count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Tokens</span>
                  </div>
                  <Badge variant="secondary">
                    {formatNumber(result.tokenCount)}
                  </Badge>
                </div>

                {/* Costs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Input</span>
                    </div>
                    <span className="text-sm font-mono">
                      {formatPrice(result.inputCost)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Output</span>
                    </div>
                    <span className="text-sm font-mono">
                      {formatPrice(result.outputCost)}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-sm">Total</span>
                      <span className="text-sm font-mono">
                        {formatPrice(totalCost)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Processing time */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Processing</span>
                  </div>
                  <span>{result.processingTime.toFixed(2)}ms</span>
                </div>

                {/* Model specs */}
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Context</span>
                    <span>{formatNumber(model.contextWindow)} tokens</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}