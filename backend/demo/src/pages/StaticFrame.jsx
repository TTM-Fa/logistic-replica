export default function StaticFrame({ src }) {
  return (
    <iframe
      src={src}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
      }}
      title="Page"
    />
  );
}
