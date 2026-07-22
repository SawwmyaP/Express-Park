import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// This endpoint is meant to be hit by a python microservice running YOLO
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cameraId, vehicleNumber, isMessy, imageUrl } = body;

    // We can update the traffic_logs to flag a messy vehicle
    // For MVP, we just find the most recent log for this vehicle and update it
    const { data, error } = await supabase
      .from("traffic_logs")
      .update({ is_messy: isMessy })
      .eq("vehicle_number", vehicleNumber)
      .eq("camera_id", cameraId)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, updated: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
