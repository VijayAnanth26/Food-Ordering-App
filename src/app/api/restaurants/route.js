// app/api/restaurants/route.js
import clientPromise from '@/utils/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('foodOrdering');

  try {
    const restaurants = await db.collection('restaurants').find({}).toArray();

    // Convert _id to id (string)
    const mapped = restaurants.map(r => ({
      ...r,
      id: r._id.toString(),
    }));

    return new Response(JSON.stringify(mapped), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch restaurants.' }),
      { status: 500 }
    );
  }
}
