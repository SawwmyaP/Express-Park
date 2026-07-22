import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";

// Note: In a real production app with large PDFs, you'd extract images first or use a service like AWS Textract/Google Cloud Vision.
// For MVP, we parse an uploaded image buffer via Tesseract.js.

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("timetable") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Run OCR
    const { data: { text } } = await Tesseract.recognize(buffer, "eng", {
      logger: m => console.log(m),
    });

    // Dummy parsing logic to extract class hours based on common SRM KTR formats
    // (e.g. "08:00 - 09:40", "10:00 - 11:40")
    // This requires complex regex depending on actual timetable formatting.
    const classHours = extractClassHours(text);

    return NextResponse.json({ 
      success: true, 
      extractedText: text,
      classHours 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function extractClassHours(text: string) {
  // Very simplified regex for time extraction HH:MM - HH:MM
  const timeRegex = /([0-9]{1,2}:[0-9]{2})\s*-\s*([0-9]{1,2}:[0-9]{2})/g;
  const matches = [...text.matchAll(timeRegex)];
  return matches.map(m => ({ start: m[1], end: m[2] }));
}
