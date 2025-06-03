import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const userId = req.headers.get("user-id");

  const cartItems = await db.collection("cart").find({ userId }).toArray();
  return NextResponse.json(cartItems);
}

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const body = await req.json();

  await db.collection("cart").insertOne(body);
  return NextResponse.json({ message: "Item added to cart" });
}

export async function DELETE(req, { params }) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  
  // If an ID is provided in the URL, delete specific item
  if (params?.id) {
    try {
      const result = await db.collection("cart").deleteOne({ 
        _id: new ObjectId(params.id) 
      });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Item deleted' }, { status: 200 });
    } catch (err) {
      console.error('Delete error:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }
  
  // If no ID provided, clear entire cart for user
  const userId = req.headers.get("user-id");
  await db.collection("cart").deleteMany({ userId });
  return NextResponse.json({ message: "Cart cleared" });
}
