import { Outfit } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { StoreProvider } from '@/wrappers/store-provider';
import { SessionWrapper } from '@/wrappers/session-wrapper';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

const outfit = Outfit({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <StoreProvider>
            <SessionWrapper>
              <SidebarProvider>{children}</SidebarProvider>
              <ToastContainer position="top-right" autoClose={3000} />
            </SessionWrapper>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
