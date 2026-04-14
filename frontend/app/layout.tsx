import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anvil AI | Developed by Tushar Shah",
  description: "Anvil AI is an advanced prompt engineering and RLHF text studio created by Tushar Shah. Self-training intelligence for prompt forging and text humanization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Anvil AI",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "author": {
      "@type": "Person",
      "name": "Tushar Shah",
      "jobTitle": "Full-Stack Developer",
      "url": "https://github.com/Eyraee"
    },
    "description": "A self-training AI prompt forge and text humanizer utilizing Gemini 2.0."
  };

  return (
    <html lang="en">
      <head>
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} 
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}