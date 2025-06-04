import clientPromise from "@/utils/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("foodOrdering");

  try {
    const methods = await db.collection("paymentMethods").find().toArray();
    return NextResponse.json(methods);
  } catch (error) {
    console.error("GET Payment Methods Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const { name } = await req.json();

  if (!name || name.trim() === "") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const newMethod = await db.collection("paymentMethods").insertOne({ name });
    return NextResponse.json(newMethod);
  } catch (error) {
    console.error("POST Payment Method Error:", error);
    return NextResponse.json({ error: "Failed to add" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const client = await clientPromise;
  const db = client.db("foodOrdering");
  const { id } = await req.json();

  try {
    const result = await db.collection("paymentMethods").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json(result);
  } catch (error) {
    console.error("DELETE Payment Method Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
