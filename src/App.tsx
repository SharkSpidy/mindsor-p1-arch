import { Children, isValidElement, useMemo, type ReactElement, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import raw from './content/architecture.md?raw';
import { Mermaid } from './components/Mermaid';
import { extractToc, slugify } from './lib/toc';

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf((node as ReactElement<{ children?: ReactNode }>).props.children);
  return '';
}

const components: Components = {
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  pre: ({ children }) => {
    const child = Children.toArray(children)[0];
    if (isValidElement(child)) {
      const props = (child as ReactElement<{ className?: string; children?: ReactNode }>).props;
      if (/language-mermaid/.test(props.className ?? '')) {
        return <Mermaid chart={textOf(props.children).trim()} />;
      }
    }
    return <pre>{children}</pre>;
  },
};

export default function App() {
  const toc = useMemo(() => extractToc(raw), []);

  return (
    <div className="layout">
      <nav className="toc" aria-label="Contents">
        <strong>Contents</strong>
        {toc.map((t) => (
          <a key={t.id} href={`#${t.id}`}>
            {t.text}
          </a>
        ))}
      </nav>
      <main className="doc">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {raw}
        </ReactMarkdown>
      </main>
    </div>
  );
}
