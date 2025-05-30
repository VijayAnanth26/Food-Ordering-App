// src/app/api/cart/[id]/route.js
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  const client = await clientPromise;
  const db = client.db('foodOrdering');
  const cartItemId = params.id;

  try {
    const result = await db.collection('cart').deleteOne({ _id: new ObjectId(cartItemId) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Item deleted' }), { status: 200 });
  } catch (err) {
    console.error('Delete error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
