import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AquaCore | 3D Digital Twin Platform - Team AquaNova",
  description: "High-end 3D Digital Twin and Real-Time Simulation Studio for the AquaCore modular water treatment and fish-gill-inspired FCDI bio-desalination cell by Team AquaNova (University of Ilorin).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
