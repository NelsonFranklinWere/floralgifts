import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json({ message: "Path is required" }, { status: 400 });
    }

    revalidatePath(path);
    
    return NextResponse.json({ revalidated: true, path });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to revalidate" },
      { status: 500 }
    );
  }
}

