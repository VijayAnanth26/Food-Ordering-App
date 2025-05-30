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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let filter = {};

    if (user.role === "Admin") {
      // No filter needed, gets all orders
      filter = {};
    } else if (user.role === "Manager") {
      // Manager sees orders from their country
      filter = { userCountry: user.country };
    } else {
      // Normal user sees only their own orders
      filter = { userId };
    }

    const orders = await db.collection("orders").find(filter).toArray();
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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = {
      ...body,
      userId, // Make sure this is stored for filtering
      status: "Processing",
      createdAt: new Date(),
      userEmail: user.email,
      userRole: user.role,
      userCountry: user.country,
    };

    const result = await db.collection("orders").insertOne(order);

    // Clear the user's cart after placing order
    await db.collection("cart").deleteMany({ userId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("ORDER API POST ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
