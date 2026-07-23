"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import dynamic from "next/dynamic";

// Dynamically import the map so it only renders on client
const CampusMap = dynamic(
  () => import("@/components/map/CampusMap").then((mod) => mod.CampusMap),
  { ssr: false }
);

export default function HomePage() {
  const t = useTranslations("HomePage");
  const router = useRouter();

  return (
    <main className="relative flex flex-col items-center min-h-screen overflow-hidden">
      {/* Background Map layer */}
      <CampusMap />

      {/* Foreground UI layer */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full min-h-screen pt-20 pb-40 px-6 pointer-events-none">
        
        {/* Floating Context Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
          className="glass-panel p-8 sm:p-12 max-w-2xl text-center pointer-events-auto rounded-3xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          >
            <span className="w-2 h-2 mr-2 rounded-full bg-emerald-400 animate-pulse" />
            Campus Parking Live
          </motion.div>

          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tighter mb-6 text-primary">
            {t.rich("title", {
              expresspark: (chunks) => <span className="italic" style={{ fontFamily: '"Times New Roman", Times, serif' }}>{chunks}</span>
            })}
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 leading-relaxed font-light">
            {t.rich("description", {
              italic: (chunks) => <span className="italic">{chunks}</span>
            })}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => router.push("/vehicle")}
              size="lg" 
              className="rounded-full px-8 h-14 text-lg bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Reserve Slot
            </Button>
            <Button 
              onClick={() => router.push("/surge")}
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 h-14 text-lg border-white/10 hover:bg-white/5 bg-transparent hover:scale-105 transition-all"
            >
              View Traffic
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
