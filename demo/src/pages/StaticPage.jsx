import { useEffect, useState } from 'react';
import styles from './StaticPage.module.css';

export default function StaticPage({ contentPath, cssPath }) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  // Inject page-specific CSS into <head> exactly once per cssPath
  useEffect(() => {
    if (!cssPath) return;
    const id = `page-css-${cssPath.replace(/\W/g, '-')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = cssPath;
    document.head.appendChild(link);
  }, [cssPath]);

  useEffect(() => {
    setLoading(true);
    fetch(contentPath)
      .then(r => r.text())
      .then(text => {
        // Strip any <link> tags that were baked into the HTML (they don't work via innerHTML anyway)
        const cleaned = text.replace(/<link[^>]*>/gi, '');
        setHtml(cleaned);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [contentPath]);

  if (loading) {
    return <div className={styles.loading} />;
  }

  return (
    <div
      className={styles.wrapper}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
