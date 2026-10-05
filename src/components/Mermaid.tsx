import { useEffect, useId, useState } from 'react';

let counter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const baseId = 'mmd-' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const [svg, setSvg] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: mermaid } = await import('mermaid');
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? 'dark' : 'default',
          securityLevel: 'strict',
        });
        const { svg: out } = await mermaid.render(`${baseId}-${counter++}`, chart);
        if (!cancelled) setSvg(out);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, baseId]);

  if (failed) return <pre className="mermaid-fallback">{chart}</pre>;
  if (!svg) return <div className="mermaid-box muted">Rendering diagram…</div>;
  return <div className="mermaid-box" dangerouslySetInnerHTML={{ __html: svg }} />;
}
