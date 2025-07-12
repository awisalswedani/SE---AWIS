"use client";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Header from '@/components/Header';
import { getSellerInfo } from '@/utils/api';
import MobileNavBar from "./MobileNavBar";
import { LanguageProvider } from '../context/LanguageContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ seller, children }: { seller: any, children: ReactNode }) {
  return (
    <LanguageProvider>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <Header seller={seller} />
          {children}
          <MobileNavBar />
        </CartProvider>
      </body>
    </LanguageProvider>
  );
} 