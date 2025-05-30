import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const userId = req.headers.get("user-id");

  const orders = await db.collection("orders").find({ userId }).toArray();
  return NextResponse.json(orders);
}

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const body = await req.json();

  const result = await db.collection("orders").insertOne({
    ...body,
    status: "Processing",
    createdAt: new Date(),
  });

  await db.collection("cart").deleteMany({ userId: body.userId });

  return NextResponse.json(result);
}
