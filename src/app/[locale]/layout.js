// src/app/[locale]/layout.js
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

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <OrdersProvider>
          <CartProvider>
            <PaymentProvider>
              <NavbarWrapper />
              <main className="flex-grow">{children}</main>
              <Footer />
            </PaymentProvider>
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
