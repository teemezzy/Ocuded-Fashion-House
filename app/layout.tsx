import type { Metadata } from "next";
import { EB_Garamond, Jost, Sacramento } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sacramento",
  display: "swap",
});

export const metadata: Metadata = {
  title: "O_Cubed Fashion House — Bespoke Bridal · Lagos",
  description:
    "Bespoke bridal gowns, thoughtfully designed and meticulously handcrafted in Lagos, Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${jost.variable} ${sacramento.variable} no-scrollbar`}
    >
      <body className="bg-bg text-ink font-sans antialiased overflow-x-hidden">
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
