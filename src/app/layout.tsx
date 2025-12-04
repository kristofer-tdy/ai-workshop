import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How LLMs Think",
  description: "An interactive visual guide to understanding Large Language Models",
  keywords: ["LLM", "AI", "machine learning", "tokens", "GPT", "Claude", "education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
