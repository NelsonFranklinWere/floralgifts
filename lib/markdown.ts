export function markdownToHtml(markdown: string): string {
  let html = markdown.trim();

  // Split into lines for processing
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      const tag = listType === 'ol' ? 'ol' : 'ul';
      const className = listType === 'ol' ? 'list-decimal' : 'list-disc';
      processedLines.push(`<${tag} class='${className} space-y-2 mb-6 ml-6'>`);
      processedLines.push(...listItems);
      processedLines.push(`</${tag}>`);
      listItems = [];
      inList = false;
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      flushList();
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      processedLines.push(`<h3 class='font-heading font-semibold text-2xl text-brand-gray-900 mt-8 mb-4'>${line.substring(4)}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      processedLines.push(`<h2 class='font-heading font-semibold text-3xl text-brand-gray-900 mt-10 mb-6'>${line.substring(3)}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      processedLines.push(`<h1 class='font-heading font-bold text-4xl text-brand-gray-900 mt-12 mb-8'>${line.substring(2)}</h1>`);
      continue;
    }

    // Lists
    const bulletMatch = line.match(/^[\*\-] (.*)$/);
    const numberMatch = line.match(/^\d+\. (.*)$/);
    
    if (bulletMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
      }
      listItems.push(`<li class='mb-2'>${processInline(bulletMatch[1])}</li>`);
      continue;
    }
    
    if (numberMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
      }
      listItems.push(`<li class='mb-2'>${processInline(numberMatch[1])}</li>`);
      continue;
    }

    // Regular paragraph
    flushList();
    processedLines.push(`<p class='mb-6 text-brand-gray-700 leading-relaxed'>${processInline(line)}</p>`);
  }

  flushList();

  return processedLines.join('\n');
}

function processInline(text: string): string {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-brand-gray-900'>$1</strong>");
  
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-green hover:underline font-medium">$1</a>');
  
  return text;
}

