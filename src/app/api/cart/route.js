import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";

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

export async function DELETE(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const userId = req.headers.get("user-id");

  await db.collection("cart").deleteMany({ userId });
  return NextResponse.json({ message: "Cart cleared" });
}