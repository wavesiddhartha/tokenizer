# 🎯 TextAnalyzer - Professional AI Text Analysis Platform

<div align="center">

![TextAnalyzer Banner](https://img.shields.io/badge/TextAnalyzer-Professional%20AI%20Analysis-blue?style=for-the-badge&logo=openai)

**The most comprehensive text tokenization and analysis platform for AI developers, researchers, and content creators.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](https://opensource.org/licenses/MIT)

[🚀 Live Demo](https://textanalyzer.vercel.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/wavesiddhartha/tokenizer/issues) • [💡 Request Feature](https://github.com/wavesiddhartha/tokenizer/issues)

</div>

---

## ✨ Features

### 🎨 **Premium Token Visualization** *(TikTokenizer-Inspired)*
- **🌈 Advanced Coloring Modes**: Rainbow, Semantic (word types), Length-based, Frequency-based
- **👁️ Interactive Tokens**: Hover effects, detailed tooltips, smooth animations
- **⚡ Real-time Updates**: See tokens update as you type with 60fps animations
- **🔍 Whitespace Visualization**: Toggle spaces (·), newlines (↵), and tabs (→)
- **📊 Live Statistics**: Token counts, word/whitespace breakdown, efficiency metrics

### 🤖 **Multi-Model AI Analysis** *(18+ Models)*
- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo, GPT-3.5 Turbo
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Google**: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro
- **Meta**: LLaMA 3.1 (405B, 70B), LLaMA 3.0
- **Mistral**: Large, Medium, and specialized models
- **Others**: Cohere Command R+, and emerging models

### 💰 **Real-Time Cost Analysis**
- **📈 Live Pricing**: Up-to-date input/output token costs
- **🏆 Best Value Detection**: Automatically identifies most cost-effective models
- **📊 Interactive Charts**: Cost distribution with rankings and insights
- **💸 Budget Planning**: Estimate costs for different text lengths
- **🔍 Provider Comparison**: Detailed breakdown by AI provider

### 🔧 **Advanced Text Processing**
- **🔠 Binary & Encoding**: Convert to binary, hex, Base64, ASCII, Unicode, octal
- **📊 Statistical Analysis**: Character frequency, entropy, compression ratios
- **🔍 Hex Dump**: Traditional hex dump format with ASCII sidebar
- **📈 Unicode Categories**: Character classification (Latin, Cyrillic, CJK, etc.)
- **⚡ Performance Metrics**: Processing speed, throughput analysis

### 📤 **Professional Export & Sharing**
- **📋 Multiple Formats**: CSV, JSON, Markdown, PDF reports
- **📊 Smart Templates**: Pre-built analysis templates
- **🌐 Web Share API**: Native sharing integration
- **⚡ Quick Export**: One-click floating action buttons
- **📄 Branded Reports**: Professional, formatted analysis documents

### 🎭 **Premium UI/UX**
- **✨ Glass Morphism**: Modern glass effects with backdrop blur
- **🎬 Smooth Animations**: Premium keyframe animations, staggered effects
- **📱 Mobile-First**: Responsive design optimized for all devices
- **🎨 Professional Theme**: Sophisticated black & white aesthetic
- **⚡ Performance Monitor**: Real-time performance tracking

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- Modern web browser with ES2020+ support

### Quick Start

```bash
# Clone the repository
git clone https://github.com/wavesiddhartha/tokenizer.git
cd tokenizer

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server  
npm start

# Or deploy to Vercel, Netlify, etc.
```

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS 4.0 with custom design system
- **Icons**: Lucide React (1000+ professional icons)
- **Tokenization**: js-tiktoken, gpt-tokenizer for accurate results
- **Build**: Next.js optimizations, tree-shaking, code splitting

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles & animations
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── TokenizerSection.tsx
│   ├── AdvancedAnalysis.tsx
│   ├── ChartsSection.tsx
│   └── ...
├── lib/                  # Utilities & business logic
│   ├── tokenizer.ts      # Core tokenization logic
│   ├── advanced-tokenizer.ts
│   ├── encodings.ts      # Binary/encoding utilities
│   ├── export-utils.ts   # Export & sharing
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
```

---

## 📖 Documentation

### Core Components

#### `TokenizerSection`
The main tokenization interface with TikTokenizer-style visualization.

```typescript
<TokenizerSection 
  text={inputText}
  colorMode="semantic" // rainbow | semantic | length | frequency
  showWhitespace={true}
  showAnimations={true}
/>
```

#### `AdvancedAnalysis`
Binary, hex, and encoding analysis with export capabilities.

```typescript
<AdvancedAnalysis 
  text={inputText}
  activeView="encodings" // encodings | analysis | characters
/>
```

#### `ChartsSection`
Interactive analytics with cost comparison and efficiency metrics.

```typescript
<ChartsSection 
  text={inputText}
  viewMode="overview" // overview | detailed | comparison
/>
```

### API Reference

#### Tokenization
```typescript
import { tokenizeAllModels, tokenizeText } from '@/lib/tokenizer';

// Analyze across all models
const results = tokenizeAllModels(text);

// Single model analysis
const result = tokenizeText(text, 'gpt-4o');
```

#### Export Functions
```typescript
import { exportToCSV, exportToJSON, exportToMarkdown } from '@/lib/export-utils';

// Export results
exportToCSV(results, 'my-analysis');
exportToJSON(exportData, 'detailed-report');
exportToMarkdown(results, text, 'summary-report');
```

---

## 🎨 Customization

### Theme Customization
The application uses a sophisticated design system built on Tailwind CSS 4.0:

```css
/* Custom CSS variables in globals.css */
:root {
  --background: #ffffff;
  --foreground: #000000;
  --radius: 16px;
  --font-geist-sans: 'Inter', system-ui;
  --font-geist-mono: 'Fira Code', monospace;
}
```

### Adding New Models
Extend the AI model database in `src/lib/tokenizer.ts`:

```typescript
export const AI_MODELS: AIModel[] = [
  {
    id: "new-model-id",
    name: "New Model Name",
    provider: "Provider Name",
    inputPrice: 0.001,
    outputPrice: 0.002,
    contextWindow: 32768,
    category: "other"
  }
];
```

### Custom Export Formats
Add new export formats in `src/lib/export-utils.ts`:

```typescript
export function exportToCustomFormat(data: TokenizationResult[]): void {
  // Custom export logic
  const customData = transformData(data);
  downloadFile(customData, 'custom-export.ext', 'application/custom');
}
```

---

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```bash
# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key

# API Keys (for real tokenizers, optional)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Deployment
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Next.js Configuration
Customize `next.config.js` for your needs:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: true, // Enable Turbopack
    optimizePackageImports: ['lucide-react']
  },
  typescript: {
    ignoreBuildErrors: false // Strict TypeScript
  }
}
```

---

## 📊 Performance

### Benchmarks
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: ~350KB gzipped

### Optimization Features
- ⚡ **Real Tokenizers**: Actual js-tiktoken & gpt-tokenizer for accuracy
- 🎯 **Code Splitting**: Dynamic imports for optimal loading
- 🗜️ **Tree Shaking**: Eliminates unused code automatically
- 📱 **Mobile Optimization**: Touch-friendly interface, optimized rendering
- 💾 **Smart Caching**: Efficient memoization and computation caching

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript types
4. Add tests for new functionality
5. Run the linter: `npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style
- **TypeScript**: Strict mode enabled, full type coverage required
- **ESLint**: Extended Next.js configuration with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

---

## 🐛 Known Issues & Limitations

### Current Limitations
- **Tokenization Accuracy**: Non-OpenAI models use heuristic tokenization
- **Offline Mode**: Requires internet connection for full functionality
- **Large Text**: Performance may degrade with texts > 100k characters
- **Mobile UX**: Some advanced features optimized for desktop

### Planned Improvements
- [ ] Native mobile app (React Native)
- [ ] Offline PWA capabilities
- [ ] Real-time collaborative analysis
- [ ] Custom model training integration
- [ ] Advanced NLP analysis (sentiment, entities, etc.)
- [ ] API endpoints for programmatic access

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Siddhartha Wave

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **TikTokenizer** - Inspiration for token visualization UI
- **OpenAI** - Tokenization algorithms and model insights
- **Anthropic** - Advanced AI model research
- **Vercel** - Next.js framework and deployment platform
- **Tailwind Labs** - Outstanding CSS framework
- **Lucide** - Beautiful icon library

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=wavesiddhartha/tokenizer&type=Timeline)](https://star-history.com/#wavesiddhartha/tokenizer&Timeline)

---

<div align="center">

**[⬆️ Back to Top](#-textanalyzer---professional-ai-text-analysis-platform)**

Made with ❤️ by [Siddhartha Wave](https://github.com/wavesiddhartha)

*If you found this project helpful, please consider giving it a ⭐!*

</div>