"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  BarChart3, 
  FileType, 
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { AI_MODELS } from "@/lib/tokenizer";

interface HeroSectionProps {
  onScrollToAnalyzer: () => void;
}

export default function HeroSection({ onScrollToAnalyzer }: HeroSectionProps) {
  const totalModels = AI_MODELS.length;
  const providers = Array.from(new Set(AI_MODELS.map(model => model.provider)));
  
  const features = [
    "Real-time tokenization analysis",
    "Cost comparison across models", 
    "Multi-format text conversion",
    "Advanced analytics & insights"
  ];

  const stats = [
    { label: "AI Models", value: `${totalModels}+`, icon: Zap },
    { label: "Providers", value: `${providers.length}`, icon: Globe },
    { label: "Formats", value: "5+", icon: FileType },
    { label: "Analytics", value: "Real-time", icon: BarChart3 },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f3f4f6%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge className="px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors">
              <Sparkles className="h-4 w-4 mr-2" />
              Professional AI Text Analysis Platform
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="gradient-text text-balance">
                TextAnalyzer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
              Compare tokenization across{" "}
              <span className="font-bold text-black">{totalModels}+ AI models</span>,{" "}
              analyze costs in real-time, and convert text to multiple formats
            </p>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={onScrollToAnalyzer}
              className="premium-button text-lg px-8 py-6 rounded-xl group"
            >
              Start Analyzing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-xl border-2 border-black hover:bg-black hover:text-white"
            >
              View Demo
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-16">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card hover:shadow-premium-lg transition-all duration-300">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="p-3 bg-black rounded-xl mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Supported Models Preview */}
          <div className="pt-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Supported AI Models
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {providers.map((provider) => {
                const modelCount = AI_MODELS.filter(m => m.provider === provider).length;
                return (
                  <Badge
                    key={provider}
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium border-gray-300 hover:border-black hover:bg-gray-50 transition-colors"
                  >
                    {provider} ({modelCount})
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}