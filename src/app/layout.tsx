import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from "@/app/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CMR Prospect',
  description: 'Application de gestion des prospects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-background text-gray-800`}>
         <Providers>
          {children}
          <Toaster position="top-center" richColors />
          </Providers>
      </body>
    </html>
  );
}
