import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const restaurantId = await params.id;

  try {
    const client = await clientPromise;
    const db = client.db('foodOrdering');

    const objectId = new ObjectId(restaurantId);

    const restaurant = await db.collection('restaurants').findOne({ _id: objectId });
    if (!restaurant) {
      return NextResponse.json({ message: 'Restaurant not found' }, { status: 404 });
    }

    // Format restaurant details for frontend
    const formattedRestaurant = {
      ...restaurant,
      id: restaurant._id.toString(),
      _id: restaurant._id.toString(),
    };

    // Check if this is a request just for restaurant info
    const requestType = request.nextUrl.searchParams.get('type');
    if (requestType === 'restaurant_only') {
      return NextResponse.json(formattedRestaurant);
    }

    // Assuming menuItems.restaurantId is stored as ObjectId
    const menuItems = await db.collection('menuItems')
      .find({ restaurantId: objectId })
      .toArray();

    const mapped = menuItems.map(item => ({
      ...item,
      id: item._id.toString(),
      _id: item._id.toString(), // Keep _id as string for consistency
    }));

    return NextResponse.json({
      restaurant: formattedRestaurant,
      restaurantName: restaurant.name,
      menuItems: mapped
    });

  } catch (error) {
    console.error('Error fetching restaurant data:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
