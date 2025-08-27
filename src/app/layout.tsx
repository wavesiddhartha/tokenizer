import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TextAnalyzer - Professional AI Text Analysis Platform",
  description: "Compare tokenization across 18+ AI models, analyze costs in real-time, and convert text to multiple formats. Features premium token visualization inspired by TikTokenizer.",
  keywords: "AI, tokenization, text analysis, GPT, Claude, Gemini, cost analysis, token counter, text converter",
  authors: [{ name: "TextAnalyzer Team" }],
  creator: "TextAnalyzer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "TextAnalyzer - Professional AI Text Analysis Platform",
    description: "Compare tokenization across 18+ AI models with premium token visualization. Analyze costs and convert text to multiple formats.",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
