import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lotId, vehicleType, startTime, endTime } = body;

    // Generate a secure hash for the QR code
    const qrData = `${userId}-${lotId}-${startTime}-${Date.now()}`;
    const qrHash = crypto.createHash("sha256").update(qrData).digest("hex");

    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          user_id: userId,
          lot_id: lotId,
          vehicle_type: vehicleType,
          start_time: startTime,
          end_time: endTime,
          qr_hash: qrHash,
          status: "active",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, reservation: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    let query = supabase.from("reservations").select(`*, parking_lots(name, block)`);
    
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, reservations: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
