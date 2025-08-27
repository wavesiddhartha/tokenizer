export interface ConversionResult {
  format: string;
  content: string;
  success: boolean;
  error?: string;
}

export function convertToJSON(text: string): ConversionResult {
  try {
    // Try to parse as existing JSON first
    try {
      const parsed = JSON.parse(text);
      return {
        format: "JSON",
        content: JSON.stringify(parsed, null, 2),
        success: true,
      };
    } catch {
      // If not valid JSON, convert text to JSON structure
      const lines = text.split('\n').filter(line => line.trim());
      const jsonObject = {
        text: text,
        lines: lines,
        metadata: {
          lineCount: lines.length,
          characterCount: text.length,
          wordCount: text.trim() ? text.trim().split(/\s+/).length : 0,
        }
      };
      
      return {
        format: "JSON",
        content: JSON.stringify(jsonObject, null, 2),
        success: true,
      };
    }
  } catch (error) {
    return {
      format: "JSON",
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function convertToXML(text: string): ConversionResult {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<document>\n';
    
    lines.forEach((line, index) => {
      const escapedLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      xml += `  <line id="${index + 1}">${escapedLine}</line>\n`;
    });
    
    xml += '</document>';
    
    return {
      format: "XML",
      content: xml,
      success: true,
    };
  } catch (error) {
    return {
      format: "XML",
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function convertToCSV(text: string): ConversionResult {
  try {
    const lines = text.split('\n');
    let csv = "Line,Content,Characters,Words\n";
    
    lines.forEach((line, index) => {
      const wordCount = line.trim() ? line.trim().split(/\s+/).length : 0;
      const escapedContent = `"${line.replace(/"/g, '""')}"`;
      csv += `${index + 1},${escapedContent},${line.length},${wordCount}\n`;
    });
    
    return {
      format: "CSV",
      content: csv,
      success: true,
    };
  } catch (error) {
    return {
      format: "CSV",
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function convertToMarkdown(text: string): ConversionResult {
  try {
    const lines = text.split('\n');
    let markdown = "# Text Analysis\n\n";
    
    // Add metadata
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    markdown += "## Metadata\n\n";
    markdown += `- **Lines**: ${lines.length}\n`;
    markdown += `- **Characters**: ${text.length}\n`;
    markdown += `- **Words**: ${wordCount}\n\n`;
    
    // Add content
    markdown += "## Content\n\n";
    lines.forEach((line, index) => {
      if (line.trim()) {
        markdown += `${index + 1}. ${line}\n`;
      } else {
        markdown += `${index + 1}. *(empty line)*\n`;
      }
    });
    
    return {
      format: "Markdown",
      content: markdown,
      success: true,
    };
  } catch (error) {
    return {
      format: "Markdown",
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function convertToHTML(text: string): ConversionResult {
  try {
    const lines = text.split('\n');
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Analysis</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .metadata { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .line { padding: 5px 0; border-bottom: 1px solid #eee; }
        .line-number { color: #666; font-weight: bold; margin-right: 10px; }
    </style>
</head>
<body>
    <h1>Text Analysis</h1>
    <div class="metadata">
        <h2>Metadata</h2>
        <p><strong>Lines:</strong> ${lines.length}</p>
        <p><strong>Characters:</strong> ${text.length}</p>
        <p><strong>Words:</strong> ${text.trim() ? text.trim().split(/\s+/).length : 0}</p>
    </div>
    <h2>Content</h2>
    <div class="content">
`;

    lines.forEach((line, index) => {
      const escapedLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      html += `        <div class="line"><span class="line-number">${index + 1}:</span>${escapedLine || '(empty line)'}</div>\n`;
    });

    html += `    </div>
</body>
</html>`;

    return {
      format: "HTML",
      content: html,
      success: true,
    };
  } catch (error) {
    return {
      format: "HTML",
      content: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const CONVERSION_FORMATS = [
  { id: "json", name: "JSON", description: "Convert to JSON format" },
  { id: "xml", name: "XML", description: "Convert to XML format" },
  { id: "csv", name: "CSV", description: "Convert to CSV format" },
  { id: "markdown", name: "Markdown", description: "Convert to Markdown format" },
  { id: "html", name: "HTML", description: "Convert to HTML format" },
];

export function convertText(text: string, format: string): ConversionResult {
  switch (format.toLowerCase()) {
    case "json":
      return convertToJSON(text);
    case "xml":
      return convertToXML(text);
    case "csv":
      return convertToCSV(text);
    case "markdown":
      return convertToMarkdown(text);
    case "html":
      return convertToHTML(text);
    default:
      return {
        format,
        content: "",
        success: false,
        error: `Unsupported format: ${format}`,
      };
  }
}