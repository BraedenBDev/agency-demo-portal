export const metadata = {
  title: 'Demos — Almost Impossible Agency',
  description: 'Live demos, microsites, and tech experiments from the Almost Impossible Agency.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: '#0f0f1a',
          color: '#f5f5f7',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
