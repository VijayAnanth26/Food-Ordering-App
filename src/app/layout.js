// src/app/layout.js
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { OrdersProvider } from '@/context/OrdersContext';
import NavbarWrapper from '@/components/NavBarWrapper';
import { PaymentProvider } from '@/context/PaymentContext';

export const metadata = {
  title: 'Fury Foods',
  description: 'Role-based food ordering app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen m-0 p-0">
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <PaymentProvider>
                {/* Navbar always on top */}
                <NavbarWrapper />

                {/* Main content guarded */}
                <AuthGuard>
                  <main className="flex-grow">{children}</main>
                </AuthGuard>

                {/* Footer always at bottom */}
                <Footer />
              </PaymentProvider>
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
