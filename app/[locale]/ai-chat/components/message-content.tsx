'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface MessageContentProps {
  content: string
  isUser: boolean
}

export function MessageContent({ content, isUser }: MessageContentProps) {
  if (isUser) {
    // User messages don't need markdown parsing
    return <p className="whitespace-pre-wrap text-sm">{content}</p>
  }

  // AI messages with full markdown support
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Custom styling for markdown elements
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,

          // Links - open in new tab
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              {children}
            </a>
          ),

          // Images - responsive with max width
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="my-2 max-w-full rounded-lg shadow-md"
              loading="lazy"
            />
          ),

          // Code blocks with syntax highlighting background
          code: ({ className, children }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">
                  {children}
                </code>
              )
            }
            return (
              <code className="block overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                {children}
              </code>
            )
          },

          // Pre - wrapper for code blocks
          pre: ({ children }) => <pre className="my-2">{children}</pre>,

          // Lists
          ul: ({ children }) => <ul className="ml-4 list-disc space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="ml-4 list-decimal space-y-1">{children}</ol>,

          // Headings
          h1: ({ children }) => <h1 className="mb-2 text-xl font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-2 text-lg font-bold">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-2 text-base font-bold">{children}</h3>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-gray-50 px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t px-3 py-2 text-sm text-gray-900">{children}</td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-4 border-gray-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
