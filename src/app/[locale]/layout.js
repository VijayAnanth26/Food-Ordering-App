import '@/styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { OrdersProvider } from '@/context/OrdersContext';
import { PaymentProvider } from '@/context/PaymentContext';

import NavbarWrapper from '@/components/NavBarWrapper';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Fury Foods',
  description: 'Role-based food ordering app',
};

// This option disables automatic static optimization for internationalized pages
export const dynamic = 'force-dynamic';

// Disable Next.js from prefetching CSS for dynamic routes in development
export const generateStaticParams = async () => {
  return [];
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className="h-full">
      <head>
        {/* Disable preloading of CSS resources to prevent warnings */}
        <meta name="next-size-adjust" />
      </head>
      <body className="flex flex-col min-h-screen m-0 p-0">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <OrdersProvider>
              <CartProvider>
                <PaymentProvider>
                  <div className="flex flex-col min-h-screen">
                    <NavbarWrapper />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                  </div>
                </PaymentProvider>
              </CartProvider>
            </OrdersProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
