// frontend/src/app/dashboard/page.js
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('common.dashboard');
  const { user } = useAuth();
  const router = useRouter();

  const role = user?.role || 'Guest';

  const canViewRestaurants = true;
  const canAddItems = true;
  const canPlaceOrder = user && (role === 'Admin' || role.startsWith('Manager'));
  const canCancelOrder = user && (role === 'Admin' || role.startsWith('Manager'));
  const canModifyPayment = user && role === 'Admin';

  const goTo = (path) => router.push(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center drop-shadow">
          {t('title')}
        </h1>

        <p className="text-center text-lg mb-6 text-gray-700">
          {t('loggedInAs')} <span className="font-semibold">{role}</span>
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* View Restaurants */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">{t('viewRestaurants.title')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('viewRestaurants.description')}</p>
            <button
              onClick={() => goTo('/restaurants')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              {t('viewRestaurants.button')}
            </button>
          </li>

          {/* Add Items to Cart */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">{t('createOrder.title')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('createOrder.description')}</p>
            <button
              onClick={() => goTo('/restaurants')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              {t('createOrder.button')}
            </button>
          </li>

          {/* Place Order */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">{t('placeOrder.title')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('placeOrder.description')}</p>
            <button
              onClick={() => goTo('/cart')}
              disabled={!canPlaceOrder}
              className={`${
                canPlaceOrder
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
            >
              {canPlaceOrder ? t('placeOrder.button') : t('placeOrder.notAllowed')}
            </button>
          </li>

          {/* Cancel Order */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">{t('cancelOrder.title')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('cancelOrder.description')}</p>
            <button
              onClick={() => goTo('/orders')}
              disabled={!canCancelOrder}
              className={`${
                canCancelOrder
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
            >
              {canCancelOrder ? t('cancelOrder.button') : t('cancelOrder.notAllowed')}
            </button>
          </li>

          {/* Modify Payment Methods - Only for Admin */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">{t('paymentMethods.title')}</h2>
            <p className="text-sm text-gray-600 mb-4">{t('paymentMethods.description')}</p>
            <button
              onClick={() => goTo('/PaymentMethods')}
              disabled={!canModifyPayment}
              className={`${
                canModifyPayment
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
            >
              {canModifyPayment ? t('paymentMethods.button') : t('paymentMethods.notAllowed')}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
