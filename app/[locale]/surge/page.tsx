"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Zap, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SurgeLevel = "low" | "medium" | "high";

export default function SurgePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "results">("idle");
  const [results, setResults] = useState<{
    surgeLevel: SurgeLevel;
    suggestion: string;
    classHours: { start: string; end: string }[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessTimetable = async () => {
    if (!file) return;
    setStatus("uploading");

    try {
      // 1. Send to OCR endpoint
      const formData = new FormData();
      formData.append("timetable", file);

      setStatus("processing");
      const ocrRes = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });
      const ocrData = await ocrRes.json();

      if (!ocrData.success) throw new Error("OCR Failed");

      // 2. Fetch Surge Prediction based on first class (Mock logic)
      // We pass a mock block for now. In a real app, the block is derived from the timetable or user profile.
      const surgeRes = await fetch("/api/surge?block=Tech%20Park");
      const surgeData = await surgeRes.json();

      if (!surgeData.success) throw new Error("Surge Prediction Failed");

      // 3. Display Results
      setResults({
        surgeLevel: surgeData.surgeLevel,
        suggestion: surgeData.suggestion,
        classHours: ocrData.classHours.length > 0 ? ocrData.classHours : [{ start: "08:00", end: "09:40" }], // Fallback for mock
      });
      setStatus("results");

    } catch (error) {
      console.error(error);
      setStatus("idle"); // In a real app, handle error state
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-40 px-6 sm:px-12 max-w-4xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/5 rounded-2xl">
          <Zap className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-3">Surge Predictor</h1>
        <p className="text-muted-foreground text-lg font-light max-w-lg mx-auto">
          Upload your timetable to receive personalized parking predictions and avoid campus traffic.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md glass-panel p-12 rounded-[2rem] flex flex-col items-center justify-center border-dashed border-2 border-white/10 relative overflow-hidden"
          >
            <input 
              type="file" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-2">Upload Timetable</h3>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Drag & drop or click to browse. Supports PDF, PNG, JPG.
            </p>
            
            {file && (
              <div className="w-full p-3 bg-white/5 rounded-xl flex items-center justify-between z-20">
                <span className="text-sm truncate mr-4">{file.name}</span>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleProcessTimetable(); }}
                  className="rounded-full h-8 px-4 bg-white text-black hover:bg-white/90"
                >
                  Analyze
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {(status === "uploading" || status === "processing") && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md glass-panel p-12 rounded-[2rem] flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-emerald-400 animate-spin mb-6" />
            <h3 className="text-xl font-medium mb-2">
              {status === "uploading" ? "Uploading..." : "Running OCR Analysis..."}
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Extracting class hours and cross-referencing with live campus traffic.
            </p>
          </motion.div>
        )}

        {status === "results" && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full glass-panel p-8 sm:p-12 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Detected Classes
                </h3>
                <div className="space-y-3">
                  {results.classHours.map((hr, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Session {idx + 1}</span>
                      <span className="font-medium">{hr.start} — {hr.end}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-center">
              <div className="text-center md:text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
                  results.surgeLevel === "high" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                  results.surgeLevel === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {results.surgeLevel === "high" && <AlertTriangle className="w-4 h-4" />}
                  {results.surgeLevel === "medium" && <AlertTriangle className="w-4 h-4" />}
                  {results.surgeLevel === "low" && <CheckCircle2 className="w-4 h-4" />}
                  {results.surgeLevel.toUpperCase()} SURGE
                </div>
                
                <h2 className="text-3xl font-light mb-4">Traffic Prediction</h2>
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  {results.suggestion}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <Button 
                  onClick={() => setStatus("idle")}
                  variant="outline" 
                  className="w-full rounded-full h-12 border-white/10 hover:bg-white/5"
                >
                  Analyze Another
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
