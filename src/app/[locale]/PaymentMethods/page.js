'use client';
import { useAuth } from '@/context/AuthContext';
import { usePayment } from '@/context/PaymentContext';
import { useRouter } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function PaymentPage() {
  const t = useTranslations('common.paymentMethods');
  const { user, loading } = useAuth();
  const {
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
  } = usePayment();
  const [newMethod, setNewMethod] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8">{t('loading')}</div>;
  }

  if (user.role !== 'Admin') {
    return <div className="p-8 text-red-500">{t('accessDenied')}</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

      <ul className="mb-4 space-y-2">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <li key={method._id} className="flex justify-between items-center bg-white p-3 shadow rounded">
              <span>{method.name}</span>
              <button
                onClick={() => removePaymentMethod(method._id)}
                className="text-red-600 hover:underline"
              >
                {t('deleteButton')}
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center py-3">{t('noMethods')}</li>
        )}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t('addPlaceholder')}
          value={newMethod}
          onChange={(e) => setNewMethod(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={() => {
            if (!newMethod.trim()) return;
            addPaymentMethod(newMethod.trim());
            setNewMethod('');
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          {t('addButton')}
        </button>
      </div>
    </div>
  );
}
