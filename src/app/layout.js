import { Inter, Outfit } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Ignite - Sleep Coach",
  description: "Modern full-stack sleep coaching app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-bg text-brand-text antialiased relative overflow-x-hidden">
        
        {/* Background Gradients */}
        <div className="fixed w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(139,120,200,0.07)_0%,transparent_65%)] -top-[200px] left-1/2 -translate-x-1/2 pointer-events-none -z-10" />
        <div className="fixed w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(100,210,180,0.05)_0%,transparent_65%)] -bottom-[100px] -right-[100px] pointer-events-none -z-10" />

        <Navbar />

        {/* Main Content */}
        <main className="flex-1 pt-24 pb-12 flex flex-col items-center justify-center px-4 w-full max-w-4xl mx-auto">
          {children}
        </main>

      </body>
    </html>
  );
}
