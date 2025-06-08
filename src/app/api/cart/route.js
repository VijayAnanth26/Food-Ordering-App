// Example: /api/cart/route.js

import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");

  const userId = req.headers.get("user-id");
  const userRole = req.headers.get("user-role");
  const userCountry = req.headers.get("user-country");

  if (!userRole || !userCountry) {
    return NextResponse.json({ error: "Missing role or country" }, { status: 400 });
  }

  let ownerKey;
  if (userRole.toLowerCase() === "admin") {
    ownerKey = userId; // Admin carts are per user
  } else {
    ownerKey = userCountry; // Non-admins share by country
  }

  const cartItems = await db.collection("cart").find({ ownerKey }).toArray();
  return NextResponse.json(cartItems);
}

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");

  const userId = req.headers.get("user-id");
  const userRole = req.headers.get("user-role");
  const userCountry = req.headers.get("user-country");

  if (!userRole || !userCountry) {
    return NextResponse.json({ error: "Missing role or country" }, { status: 400 });
  }

  let ownerKey;
  if (userRole.toLowerCase() === "admin") {
    ownerKey = userId;
  } else {
    ownerKey = userCountry;
  }

  const body = await req.json();
  const cartItems = Array.isArray(body) ? body : [body];

  // Prepare bulk operations
  const operations = cartItems.map(item => ({
    updateOne: {
      filter: { 
        ownerKey,
        id: item.id // Using item.id for matching
      },
      update: { 
        $set: { ...item, ownerKey }
      },
      upsert: true
    }
  }));

  try {
    await db.collection("cart").bulkWrite(operations);
    return NextResponse.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");

  const userId = req.headers.get("user-id");
  const userRole = req.headers.get("user-role");
  const userCountry = req.headers.get("user-country");

  if (!userRole || !userCountry) {
    return NextResponse.json({ error: "Missing role or country" }, { status: 400 });
  }

  let ownerKey;
  if (userRole.toLowerCase() === "admin") {
    ownerKey = userId;
  } else {
    ownerKey = userCountry;
  }

  await db.collection("cart").deleteMany({ ownerKey });

  return NextResponse.json({ message: "Cart cleared" });
}
