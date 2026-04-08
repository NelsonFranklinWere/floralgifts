import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getOrderById, updateOrder } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const productIds = Array.from(
      new Set(
        (order.items || [])
          .map((it: any) => it?.productId)
          .filter((v: any) => typeof v === "string" && v.length > 0)
      )
    );

    let productsById: Record<string, { id: string; slug: string; title: string; images: string[] }> = {};
    if (productIds.length > 0) {
      const { data, error } = await (supabaseAdmin.from("products") as any)
        .select("id,slug,title,images")
        .in("id", productIds);

      if (!error && Array.isArray(data)) {
        productsById = (data as any[]).reduce((acc, p) => {
          acc[p.id] = {
            id: p.id,
            slug: p.slug,
            title: p.title,
            images: p.images || [],
          };
          return acc;
        }, {} as Record<string, { id: string; slug: string; title: string; images: string[] }>);
      }
    }

    return NextResponse.json({ order, productsById });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);
    const { id } = await params;
    const body = await request.json();

    const order = await updateOrder(id, {
      status: body.status as any,
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

