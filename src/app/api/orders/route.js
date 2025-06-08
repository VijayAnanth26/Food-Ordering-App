// api/orders/route.js
import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const userId = req.headers.get("user-id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let orders = [];

    if (user.role === "Admin") {
      orders = await db.collection("orders").find().sort({ createdAt: -1 }).toArray();
    } else {
      orders = await db.collection("orders").find({ userCountry: user.country }).sort({ createdAt: -1 }).toArray();
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ORDER API GET ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");

  try {
    const body = await req.json();
    const { userId, items, total, paymentMethod, restaurantDetails } = body;

    if (!userId || !items || !total) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Extract restaurant info from the first item if available
    const restaurantName = items[0]?.restaurantName || null;
    const restaurantId = items[0]?.restaurantId || null;

    // Create order object with basic details
    const order = {
      items,
      total,
      paymentMethod: paymentMethod,
      status: "Ordered",
      createdAt: new Date(),
      userId: new ObjectId(userId),
      userEmail: user.email,
      userRole: user.role,
      userCountry: user.country,
      restaurantName,
      restaurantId
    };

    // Add restaurant details if available
    if (restaurantDetails) {
      // Only include essential restaurant information to keep the order document size reasonable
      order.restaurantDetails = {
        name: restaurantDetails.name,
        cuisine: restaurantDetails.cuisine,
        city: restaurantDetails.city,
        address: restaurantDetails.address,
        image: restaurantDetails.image,
      };
    }

    const result = await db.collection("orders").insertOne(order);

    await db.collection("cart").deleteMany({ userId });

    return NextResponse.json({ 
      success: true, 
      _id: result.insertedId,
      orderId: result.insertedId 
    });
  } catch (error) {
    console.error("ORDER API POST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
