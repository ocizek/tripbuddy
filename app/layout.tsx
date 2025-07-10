export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head />
      <body>{children}</body>
    </html>
  );
}
