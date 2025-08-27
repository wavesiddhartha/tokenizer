"use client";

import React from "react";
import { Loader2, Zap } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  type?: "spinner" | "pulse" | "dots";
}

export default function LoadingSpinner({ 
  size = "md", 
  text = "Analyzing...", 
  type = "spinner" 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  if (type === "pulse") {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="relative">
          <Zap className={`${sizeClasses[size]} text-blue-600 animate-pulse`} />
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-25" />
        </div>
        {text && <span className="text-sm text-muted-foreground animate-pulse">{text}</span>}
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        {text && <span className="text-sm text-muted-foreground ml-3">{text}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}