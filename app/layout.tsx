import SaveUserDetail from "@/app/(auth)/_components/SaveUserDetail";
import ScrollTopButton from "@/components/ScrollTopButton";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "../lib/fontawesome";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
const inter = Quicksand({ subsets: ["vietnamese"] });
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "LearnEase - Kết nối tri thức",
  description: "Kết nối tri thức",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <SaveUserDetail />
            {children}
            <ScrollTopButton />
            <Toaster />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
