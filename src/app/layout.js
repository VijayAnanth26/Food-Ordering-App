// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen m-0 p-0">{children}</body>
    </html>
  );
}
