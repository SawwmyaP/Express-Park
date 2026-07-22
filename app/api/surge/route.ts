import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const block = searchParams.get("block"); // e.g., 'UB', 'Tech Park'
  
  // Dummy logic: We predict a surge just before common class starting times
  // 8:00 AM, 10:00 AM, 12:30 PM, etc.
  const currentHour = new Date().getHours();
  
  let surgeLevel = "low";
  let suggestion = "Parking available.";

  // Highly simplified heuristic based on time of day
  if (currentHour === 7 || currentHour === 9 || currentHour === 12) {
    surgeLevel = "high";
    suggestion = `Expect heavy traffic near ${block || "academic blocks"}. Consider arriving 15 minutes early or parking at alternative lots.`;
  } else if (currentHour === 8 || currentHour === 10 || currentHour === 13) {
    surgeLevel = "medium";
    suggestion = "Classes have started, limited spots available.";
  }

  return NextResponse.json({
    success: true,
    surgeLevel,
    suggestion,
    block
  });
}
