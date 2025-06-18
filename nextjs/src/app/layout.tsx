import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import { ChatWidgetProvider } from "@/components/ChatWidgetContext";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patoekipa - Portfolio",
  description: "Grupa przyjaciół z dzieciństwa, która nadal utrzymuje kontakt oraz wszyscy z ekipy skończyli w IT. Jesteśmy gotowi do działania!",
  keywords: ["portfolio", "IT", "Flutter", "Next.js", "React", "TypeScript", "web development"],
  authors: [{ name: "Patoekipa Team" }],
  openGraph: {
    title: "Patoekipa - Portfolio",
    description: "Grupa przyjaciół z dzieciństwa w IT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body
        className={`${interSans.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ChatWidgetProvider>
          {children}
          <ChatWidget />
        </ChatWidgetProvider>
      </body>
    </html>
  );
}
