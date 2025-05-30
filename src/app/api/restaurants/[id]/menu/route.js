import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const restaurantId = params.id;

  try {
    const client = await clientPromise;
    const db = client.db('foodOrdering');

    const objectId = new ObjectId(restaurantId);

    const restaurant = await db.collection('restaurants').findOne({ _id: objectId });
    if (!restaurant) {
      return new Response(JSON.stringify({ message: 'Restaurant not found' }), { status: 404 });
    }

    // Assuming menuItems.restaurantId is stored as ObjectId
    const menuItems = await db.collection('menuItems')
  .find({ restaurantId: objectId })
  .toArray();

const mapped = menuItems.map(item => ({
  ...item,
  id: item._id.toString(),
  _id: undefined, // optional: remove _id if not needed
}));

return new Response(JSON.stringify({
  restaurantName: restaurant.name,
  menuItems: mapped
}), { status: 200 });

  } catch (error) {
    console.error('Menu fetch error:', error);
    return new Response(JSON.stringify({ message: 'Server error', error }), { status: 500 });
  }
}
