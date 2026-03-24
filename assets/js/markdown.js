/**
 * Simple Markdown to HTML Converter
 * Usage in Node.js or build scripts
 */

function markdownToHtml(markdown) {
  let html = markdown;

  // Escape HTML characters first
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore markdown syntax for processing
  html = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Blockquote
  html = html.replace(/^> (.*?)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, (match) => `<ul>${match}</ul>`);

  // Paragraphs - split by double newlines
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs.map(para => {
    if (para.startsWith('<') || para.trim() === '') {
      return para;
    }
    return `<p>${para.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  return html;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { markdownToHtml };
}
