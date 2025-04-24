import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Children Book AI Generator",
  description:
    "Create a children book with AI generated text and illustrations.",
};

function Header() {
  return (
    <header
      className="header"
      style={{
        display: "flex",
        justifyContent: "end",
        padding: 10,
        width: "100%",
        position: "absolute",
      }}
    >
      <div className="flex items-center justify-center space-x-4">
        {/* <SignedIn>
          <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-3xl border border-white px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-[#2d06ff4a] hover:text-white">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded-3xl bg-white px-4 py-2 transition duration-300 ease-in-out">
              Sign up
            </button>
          </SignUpButton>
        </SignedOut> */}
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body>
          <Header />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
