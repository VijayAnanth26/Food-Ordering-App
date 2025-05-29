// frontend/src/app/dashboard/page.js
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const role = user?.role || 'Guest';

  const canViewRestaurants = true;
  const canAddItems = true;
  const canPlaceOrder = user && (role === 'Admin' || role.startsWith('Manager'));
  const canCancelOrder = user && (role === 'Admin' || role.startsWith('Manager'));
  // Add this just below existing role declarations
  const canModifyPayment = user && role === 'Admin';


  const goTo = (path) => router.push(path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center drop-shadow">
          Welcome to the Dashboard
        </h1>

        <p className="text-center text-lg mb-6 text-gray-700">
          Logged in as: <span className="font-semibold">{role}</span>
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* View Restaurants */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">View Restaurants & Menu</h2>
            <p className="text-sm text-gray-600 mb-4">Explore restaurants and their menus.</p>
            <button
              onClick={() => goTo('/restaurants')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              View Restaurants
            </button>
          </li>

          {/* Add Items to Cart */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">Create Order</h2>
            <p className="text-sm text-gray-600 mb-4">Add food items to your cart.</p>
            <button
              onClick={() => goTo('/restaurants')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Add Items
            </button>
          </li>

          {/* Place Order */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">Place Order</h2>
            <p className="text-sm text-gray-600 mb-4">Proceed to place your order.</p>
            <button
              onClick={() => goTo('/cart')}
              disabled={!canPlaceOrder}
              className={`${
                canPlaceOrder
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
            >
              {canPlaceOrder ? 'Place Order' : 'Not Allowed'}
            </button>
          </li>

          {/* Cancel Order */}
          <li className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-orange-700 mb-2">Cancel Order</h2>
            <p className="text-sm text-gray-600 mb-4">Cancel a placed order.</p>
            <button
              onClick={() => goTo('/orders')}
              disabled={!canCancelOrder}
              className={`${
                canCancelOrder
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white px-4 py-2 rounded`}
            >
              {canCancelOrder ? 'Cancel Order' : 'Not Allowed'}
            </button>
          </li>

          {/* Modify Payment Methods - Only for Admin */}

  <li className="bg-white rounded-lg p-6 shadow">
    <h2 className="text-xl font-bold text-orange-700 mb-2">Modify Payment Methods</h2>
    <p className="text-sm text-gray-600 mb-4">Add, edit, or remove available payment methods.</p>
    <button
      onClick={() => goTo('/PaymentMethods')}
      disabled={!canModifyPayment}
      className={`${
        canModifyPayment
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-gray-300 cursor-not-allowed'
      } text-white px-4 py-2 rounded`}
    >
      {canModifyPayment ? 'Manage Payments' : 'Not Allowed'}
    </button>
  </li>

        </ul>
      </div>
    </div>
  );
}
