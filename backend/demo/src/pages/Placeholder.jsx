import styles from './Placeholder.module.css';

export default function Placeholder({ title }) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.body}>
        <div className={styles.card}>
          <svg className={styles.icon} aria-hidden="true">
            <use href="/images/sprite.svg#chart-empty" />
          </svg>
          <p className={styles.message}>This page is coming soon.</p>
        </div>
      </div>
    </div>
  );
}
