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
        className="bg-[#0b0d13] text-[#f1f5f9] min-h-screen font-sans flex flex-col antialiased selection:bg-[#f1f5f9] selection:text-[#0b0d13] relative"
        suppressHydrationWarning
      >
        {/* Checked pattern with tiny squares in absolute background */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-squares grid-mask-radial opacity-60" />

        {/* Ambient top spotlight */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-15%,rgba(140,130,220,0.06),transparent)]" />

        {/* Navigation Bar */}
        <header className="border-b border-[#222838] bg-[#0e121a]/85 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-[1080px] mx-auto px-6 sm:px-10 h-14 flex items-center justify-between border-x border-[#222838]">
            <div className="text-[13px] font-medium tracking-[0.03em] text-[#f8fafc] flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f8fafc] opacity-90 inline-block shadow-[0_0_8px_rgba(248,250,252,0.6)]" />
              <span>
                Clause<span className="text-[#94a3b8] font-normal">AI</span>
              </span>
            </div>
            <a
              className="text-[12px] text-[#94a3b8] hover:text-[#f8fafc] transition-colors tracking-[0.03em] flex items-center gap-1.5 font-normal group"
              href="https://github.com/RahulHarihar/contract-negotiator"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on GitHub</span>
              <span className="text-[11px] text-[#64748b] group-hover:text-[#f8fafc] transition-colors">
                ↗
              </span>
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 relative z-10">{children}</div>

        {/* Footer */}
        <footer className="border-t border-[#222838] bg-[#0e121a] relative z-10">
          <div className="max-w-[1080px] mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#94a3b8] border-x border-[#222838]">
            <div>Not legal advice. Always consult a qualified lawyer before signing.</div>
            <div className="text-[#64748b]">Built with Gemini AI · Rahul Harihar</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
