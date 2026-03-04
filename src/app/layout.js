import { Plus_Jakarta_Sans, Fuzzy_Bubbles } from "next/font/google"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"]
})

const fuzzyBubbles = Fuzzy_Bubbles({
  variable: "--font-fuzzy-sans",
  subsets: ["latin"],
  weight: ["400"]
})

export const metadata = {
  title: "Booktracker",
  description: "Track your book reading easier.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${fuzzyBubbles.variable} antialiased max-w-3xl mx-auto px-6 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
