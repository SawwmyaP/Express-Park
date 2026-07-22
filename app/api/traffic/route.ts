import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vehicleNumber, vehicleType, entryTime, cameraId } = body;

    const { data, error } = await supabase
      .from("traffic_logs")
      .insert([
        {
          vehicle_number: vehicleNumber,
          vehicle_type: vehicleType,
          entry_time: entryTime || new Date().toISOString(),
          camera_id: cameraId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, log: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    // Fetch recent traffic logs for the security dashboard
    const { data, error } = await supabase
      .from("traffic_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ success: true, logs: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
