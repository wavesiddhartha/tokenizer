"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Clock, Zap, TrendingUp, Eye, EyeOff } from "lucide-react";

interface PerformanceMetrics {
  renderTime: number;
  tokenizationTime: number;
  memoryUsage: number;
  fps: number;
  lastUpdate: number;
}

interface PerformanceMonitorProps {
  tokenizationTime?: number;
  tokenCount?: number;
  textLength?: number;
}

export default function PerformanceMonitor({ 
  tokenizationTime = 0, 
  tokenCount = 0, 
  textLength = 0 
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    tokenizationTime: 0,
    memoryUsage: 0,
    fps: 60,
    lastUpdate: Date.now()
  });

  // Update metrics
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      tokenizationTime,
      lastUpdate: Date.now()
    }));
  }, [tokenizationTime]);

  // Performance calculations
  const performanceStats = useMemo(() => {
    const tokensPerSecond = tokenizationTime > 0 ? (tokenCount / (tokenizationTime / 1000)) : 0;
    const charsPerSecond = tokenizationTime > 0 ? (textLength / (tokenizationTime / 1000)) : 0;
    const efficiency = textLength > 0 ? (tokenCount / textLength) : 0;
    
    return {
      tokensPerSecond: Math.round(tokensPerSecond),
      charsPerSecond: Math.round(charsPerSecond),
      efficiency: efficiency.toFixed(3),
      latency: tokenizationTime.toFixed(2)
    };
  }, [tokenizationTime, tokenCount, textLength]);

  // Performance rating
  const getPerformanceRating = () => {
    if (tokenizationTime < 10) return { label: "Excellent", color: "bg-green-500" };
    if (tokenizationTime < 50) return { label: "Good", color: "bg-blue-500" };
    if (tokenizationTime < 100) return { label: "Fair", color: "bg-yellow-500" };
    return { label: "Slow", color: "bg-red-500" };
  };

  const rating = getPerformanceRating();

  if (!isVisible) {
    return (
      <div className="fixed bottom-8 left-8 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-gray-200 hover:bg-white"
        >
          <Activity className="h-4 w-4 mr-2" />
          Performance
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-8 z-50 animate-in slide-in-from-bottom-4">
      <Card className="w-80 bg-white/95 backdrop-blur-md shadow-2xl border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${rating.color} text-white text-xs`}>
                {rating.label}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {performanceStats.latency}ms
              </div>
              <div className="text-xs text-blue-700">Latency</div>
            </div>
            
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {performanceStats.tokensPerSecond.toLocaleString()}
              </div>
              <div className="text-xs text-green-700">Tokens/sec</div>
            </div>
            
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {performanceStats.charsPerSecond.toLocaleString()}
              </div>
              <div className="text-xs text-purple-700">Chars/sec</div>
            </div>
            
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <div className="text-lg font-bold text-orange-600">
                {performanceStats.efficiency}
              </div>
              <div className="text-xs text-orange-700">Efficiency</div>
            </div>
          </div>
          
          {/* Performance Indicators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Processing Speed
              </span>
              <span className="font-mono">{tokenizationTime.toFixed(2)}ms</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Throughput
              </span>
              <span className="font-mono">{performanceStats.tokensPerSecond} tok/s</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Token Density
              </span>
              <span className="font-mono">{performanceStats.efficiency}</span>
            </div>
          </div>
          
          {/* Performance Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Performance Score</span>
              <span>{Math.max(0, Math.min(100, 100 - tokenizationTime)).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${rating.color}`}
                style={{ width: `${Math.max(0, Math.min(100, 100 - tokenizationTime))}%` }}
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            Last updated: {new Date(metrics.lastUpdate).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}