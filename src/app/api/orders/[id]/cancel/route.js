import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(_, { params }) {
  const { id } = params;

  try {
    const client = await clientPromise;
    const db = client.db(); // Use default DB
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'Cancelled' } }
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: 'Order cancelled.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Order not found.' }), {
        status: 404,
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
