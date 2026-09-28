import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { ToastContainer } from "../components/ToastContainer";

export const metadata: Metadata = {
  title: "KHAN DRISHTI (खान दृष्टि) | Smart Governance Platform for Coal Mines",
  description:
    "Smart India Hackathon 2026 (PS ID: 26024). KHAN DRISHTI (खान दृष्टि) – Integrated Governance, Compliance & Transparency for Indian Coal Mines under DGMS / MoEFCC / Coal India statutory framework.",
  icons: {
    icon: "/khan-drishti-logo.png",
    shortcut: "/khan-drishti-logo.png",
    apple: "/khan-drishti-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-mineBg text-mineText min-h-screen">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
