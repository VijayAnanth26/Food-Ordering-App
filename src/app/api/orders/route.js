import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const userId = req.headers.get("user-id");

  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let orders = [];

    if (user.role === "Admin") {
      orders = await db.collection("orders").find().toArray(); // Admin gets all
    } else {
      orders = await db
        .collection("orders")
        .find({ userId }) // ✅ userId is stored as string in orders
        .toArray();
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
    const { userId } = body;

    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const order = {
      ...body,
      status: "Processing",
      createdAt: new Date(),
      userEmail: user.email,
      userRole: user.role,
      userCountry: user.country,
    };

    const result = await db.collection("orders").insertOne(order);
    await db.collection("cart").deleteMany({ userId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("ORDER API POST ERROR:", error); // ✅ Log exact error
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
