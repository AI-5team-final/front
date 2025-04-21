import ReactMarkdown from 'react-markdown';

export default function MarkdownResult({ markdownText }) {
  return (
    <div className="markdown-viewer">
        <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  );
}
