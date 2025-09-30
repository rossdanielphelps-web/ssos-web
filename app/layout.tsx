// app/layout.tsx
export const metadata = {
  title: "SSOS",
  description: "Service Sprint OS",
};

import "./globals.css";

export const metadata = { title: "SSOS", description: "Service Sprint OS" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}