import { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "../components/ui/navbar";
import { ThemeProvider } from "../components/providers/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AccessControlProvider } from "@/contexts/AccessControlContext";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import Dock from "../components/ui/dock";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import DataProt from "../components/ui/dataprot";
import { ProfileCompletionPrompt } from "../components/profile/ProfileCompletionPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home4Strays",
  description: "",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale}>
          <QueryProvider>
            <AuthProvider>
              <UserProfileProvider>
                <AccessControlProvider>
                  <BookmarkProvider>
                    <ThemeProvider defaultTheme="light-h4s">
                      <div className="h-[100dvh] flex flex-col pb-16 md:pb-0">
                        <Navbar />
                        <div className="flex-1 overflow-y-auto">
                          {children}
                          <Dock />
                        </div>
                        <div className="overflow-hidden">
                          <DataProt />
                        </div>
                      </div>
                      <ProfileCompletionPrompt />
                      <Toaster position="bottom-right" />
                    </ThemeProvider>
                  </BookmarkProvider>
                </AccessControlProvider>
              </UserProfileProvider>
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
