import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClauseAI — Two contracts. One clear path forward.",
  description:
    "Upload two versions of a contract. Get a ranked breakdown of every conflict with balanced compromise language and risk ratings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className="bg-[#080808] text-[#f0ede8] min-h-screen font-sans flex flex-col antialiased selection:bg-[#f0ede8] selection:text-[#080808] relative"
        suppressHydrationWarning
      >
        {/* Checked pattern with tiny squares in absolute background */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-squares grid-mask-radial opacity-50" />

        {/* Ambient warm top spotlight (no purple/blue hue) */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-15%,rgba(200,175,130,0.025),transparent)]" />

        {/* Navigation Bar */}
        <header className="border-b border-[#1f1f1d] bg-[#080808]/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-[1080px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between border-x border-[#1f1f1d]">
            <div className="text-[13px] font-medium tracking-[0.03em] text-[#f0ede8] flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] opacity-90 inline-block shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
              <span>
                Clause<span className="text-[#c5a059] font-medium ml-0.5">AI</span>
              </span>
            </div>
            <a
              className="text-[12px] text-[#9e998e] hover:text-[#f0ede8] transition-colors tracking-[0.03em] flex items-center gap-1.5 font-normal group"
              href="https://github.com/RahulHarihar/contract-negotiator"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on GitHub</span>
              <span className="text-[11px] text-[#6b665c] group-hover:text-[#f0ede8] transition-colors">
                ↗
              </span>
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 relative z-10">{children}</div>

        {/* Footer */}
        <footer className="border-t border-[#1f1f1d] bg-[#080808] relative z-10">
          <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#9e998e] border-x border-[#1f1f1d]">
            <div>Not legal advice. Always consult a qualified lawyer before signing.</div>
            <div className="text-[#6b665c]">Built with Gemini AI · Rahul Harihar</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
