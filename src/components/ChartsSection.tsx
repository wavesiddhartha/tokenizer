"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Zap,
  Clock,
  Award,
  Target,
  Activity,
  Layers,
  Filter,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  RotateCcw,
  Star
} from "lucide-react";
import { 
  AI_MODELS, 
  TokenizationResult, 
  tokenizeAllModels 
} from "@/lib/tokenizer";
import { formatPrice, formatNumber } from "@/lib/utils";

interface ChartsSectionProps {
  text: string;
}

interface AnalyticsData {
  results: TokenizationResult[];
  cheapestInput: { model: string; cost: number };
  cheapestOutput: { model: string; cost: number };
  mostTokens: { model: string; tokens: number };
  leastTokens: { model: string; tokens: number };
  averageCost: number;
  totalRange: { min: number; max: number };
  providerStats: { [key: string]: { count: number; avgCost: number; avgTokens: number } };
}

export default function ChartsSection({ text }: ChartsSectionProps) {
  const [viewMode, setViewMode] = useState<"overview" | "detailed" | "comparison">("overview");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [showAnimations, setShowAnimations] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const analyticsData: AnalyticsData | null = useMemo(() => {
    if (!text.trim()) return null;
    
    const results = tokenizeAllModels(text);
    
    // Find extremes
    const cheapestInput = results.reduce((min, current) => 
      current.inputCost < min.cost 
        ? { model: AI_MODELS.find(m => m.id === current.modelId)!.name, cost: current.inputCost }
        : min
    , { model: "", cost: Infinity });

    const cheapestOutput = results.reduce((min, current) => 
      current.outputCost < min.cost 
        ? { model: AI_MODELS.find(m => m.id === current.modelId)!.name, cost: current.outputCost }
        : min
    , { model: "", cost: Infinity });

    const mostTokens = results.reduce((max, current) => 
      current.tokenCount > max.tokens 
        ? { model: AI_MODELS.find(m => m.id === current.modelId)!.name, tokens: current.tokenCount }
        : max
    , { model: "", tokens: 0 });

    const leastTokens = results.reduce((min, current) => 
      current.tokenCount < min.tokens 
        ? { model: AI_MODELS.find(m => m.id === current.modelId)!.name, tokens: current.tokenCount }
        : min
    , { model: "", tokens: Infinity });

    const averageCost = results.reduce((sum, r) => sum + r.inputCost + r.outputCost, 0) / results.length;
    const totalCosts = results.map(r => r.inputCost + r.outputCost);
    const totalRange = {
      min: Math.min(...totalCosts),
      max: Math.max(...totalCosts)
    };

    // Provider statistics
    const providerStats: { [key: string]: { count: number; avgCost: number; avgTokens: number } } = {};
    results.forEach(result => {
      const model = AI_MODELS.find(m => m.id === result.modelId)!;
      const provider = model.provider;
      
      if (!providerStats[provider]) {
        providerStats[provider] = { count: 0, avgCost: 0, avgTokens: 0 };
      }
      
      providerStats[provider].count++;
      providerStats[provider].avgCost += result.inputCost + result.outputCost;
      providerStats[provider].avgTokens += result.tokenCount;
    });

    Object.keys(providerStats).forEach(provider => {
      providerStats[provider].avgCost /= providerStats[provider].count;
      providerStats[provider].avgTokens /= providerStats[provider].count;
    });

    return {
      results,
      cheapestInput,
      cheapestOutput,
      mostTokens,
      leastTokens,
      averageCost,
      totalRange,
      providerStats
    };
  }, [text]);

  if (!analyticsData || !text.trim()) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Enter text to see analytics</p>
            <p className="text-sm">Detailed cost analysis and performance metrics across all models</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { results, cheapestInput, cheapestOutput, mostTokens, leastTokens, averageCost, totalRange, providerStats } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnimations(!showAnimations)}
              >
                {showAnimations ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showAnimations ? "Disable" : "Enable"} Animations
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          {/* View Mode Tabs */}
          <div className="flex gap-2 pt-4">
            <Button
              variant={viewMode === "overview" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("overview")}
            >
              Overview
            </Button>
            <Button
              variant={viewMode === "detailed" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("detailed")}
            >
              Detailed
            </Button>
            <Button
              variant={viewMode === "comparison" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("comparison")}
            >
              Comparison
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`card-hover-lift interactive-card ${showAnimations ? 'animation-delay-100' : ''}`}>
          <CardContent className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 z-10">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg">
                <Award className="h-6 w-6 text-blue-600 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Input Price</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {formatPrice(cheapestInput.cost)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">{cheapestInput.model}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-2">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`card-hover-lift interactive-card ${showAnimations ? 'animation-delay-200' : ''}`}>
          <CardContent className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 z-10">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg">
                <Target className="h-6 w-6 text-green-600 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Output Price</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {formatPrice(cheapestOutput.cost)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">{cheapestOutput.model}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`card-hover-lift interactive-card ${showAnimations ? 'animation-delay-300' : ''}`}>
          <CardContent className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 z-10">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-lg pulse-ring">
                <Zap className="h-6 w-6 text-purple-600 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Most Efficient</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  {formatNumber(leastTokens.tokens)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">{leastTokens.model}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-2">
              <Activity className="h-4 w-4 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`card-hover-lift interactive-card ${showAnimations ? 'animation-delay-500' : ''}`}>
          <CardContent className="flex items-center p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 z-10">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-orange-600 drop-shadow-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Cost</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  {formatPrice(averageCost)}
                </p>
                <p className="text-xs text-muted-foreground font-medium">Across {results.length} models</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-2">
              <Layers className="h-4 w-4 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Distribution Chart with Interactive Features */}
      <Card className="interactive-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cost Distribution Analysis
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedCard(expandedCard === 'cost' ? null : 'cost')}
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                {expandedCard === 'cost' ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Sorted by total cost (input + output). Hover bars for detailed breakdown.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.slice().sort((a, b) => (a.inputCost + a.outputCost) - (b.inputCost + b.outputCost)).map((result, index) => {
              const model = AI_MODELS.find(m => m.id === result.modelId)!;
              const totalCost = result.inputCost + result.outputCost;
              const percentage = ((totalCost - totalRange.min) / (totalRange.max - totalRange.min)) * 100;
              const rank = index + 1;
              const isTopTier = rank <= 3;
              
              return (
                <div 
                  key={result.modelId} 
                  className={`space-y-3 p-4 rounded-lg border transition-all duration-300 hover:shadow-lg hover:border-blue-300 ${
                    showAnimations ? 'hover:scale-102' : ''
                  } ${isTopTier ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' : 'bg-white'}`}
                  style={{
                    animationDelay: showAnimations ? `${index * 100}ms` : undefined,
                    animation: showAnimations ? 'slideInRight 0.5s ease-out forwards' : undefined
                  }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={isTopTier ? "default" : "outline"} 
                        className={`w-8 h-8 rounded-full flex items-center justify-center p-0 ${
                          isTopTier ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : ''
                        }`}
                      >
                        {rank}
                      </Badge>
                      <div>
                        <span className="font-semibold text-gray-900">{model.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {model.provider}
                          </Badge>
                          {isTopTier && <Badge className="text-xs bg-yellow-100 text-yellow-800">Top Pick</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-lg font-bold">{formatPrice(totalCost)}</span>
                      <div className="text-xs text-muted-foreground">
                        In: {formatPrice(result.inputCost)} | Out: {formatPrice(result.outputCost)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                          isTopTier 
                            ? 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-500'
                        } ${showAnimations ? 'token-shimmer' : ''}`}
                        style={{ 
                          width: `${Math.max(percentage, 2)}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference">
                      {percentage.toFixed(1)}% of max cost
                    </div>
                  </div>
                  
                  {/* Additional Metrics */}
                  {expandedCard === 'cost' && (
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">{result.tokenCount}</div>
                        <div className="text-xs text-muted-foreground">Tokens</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice((result.inputCost + result.outputCost) / result.tokenCount * 1000)}
                        </div>
                        <div className="text-xs text-muted-foreground">$/1K tokens</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{result.processingTime.toFixed(1)}ms</div>
                        <div className="text-xs text-muted-foreground">Processing</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{formatPrice(totalRange.max)}</div>
                <div className="text-xs text-muted-foreground">Most Expensive</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatPrice(averageCost)}</div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formatPrice(totalRange.min)}</div>
                <div className="text-xs text-muted-foreground">Most Affordable</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Provider Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(providerStats).map(([provider, stats]) => (
              <div key={provider} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{provider}</h3>
                  <Badge variant="secondary">{stats.count} models</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Cost:</span>
                    <span className="font-mono">{formatPrice(stats.avgCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Tokens:</span>
                    <span className="font-mono">{formatNumber(Math.round(stats.avgTokens))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className="font-mono">
                      {formatPrice(stats.avgCost / stats.avgTokens * 1000)}/1K
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token Efficiency Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Token Efficiency Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.slice().sort((a, b) => a.tokenCount - b.tokenCount).map((result, index) => {
              const model = AI_MODELS.find(m => m.id === result.modelId)!;
              const efficiency = ((leastTokens.tokens / result.tokenCount) * 100);
              
              return (
                <div key={result.modelId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={index < 3 ? "default" : "outline"} className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-sm text-muted-foreground">{model.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg">{formatNumber(result.tokenCount)}</p>
                    <p className="text-sm text-muted-foreground">{efficiency.toFixed(1)}% efficiency</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatNumber(Math.round(results.reduce((sum, r) => sum + r.tokenCount, 0) / results.length))}
              </div>
              <p className="text-sm font-medium">Average Tokens</p>
              <p className="text-xs text-muted-foreground">Across all models</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(((mostTokens.tokens - leastTokens.tokens) / leastTokens.tokens) * 100).toFixed(0)}%
              </div>
              <p className="text-sm font-medium">Token Variance</p>
              <p className="text-xs text-muted-foreground">Between models</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {((totalRange.max / totalRange.min)).toFixed(1)}x
              </div>
              <p className="text-sm font-medium">Cost Range</p>
              <p className="text-xs text-muted-foreground">Max vs Min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}