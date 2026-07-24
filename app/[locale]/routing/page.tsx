"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, MapPin, ArrowDownToLine, Route } from "lucide-react";
import { locations } from "@/data/srm-campus";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Dynamically import the map so it only renders on client
const CampusMap = dynamic(
  () => import("@/components/map/CampusMap").then((mod) => mod.CampusMap),
  { ssr: false }
);

export default function RoutingPage() {
  const t = useTranslations("RoutingPage");
  const [startPoint, setStartPoint] = useState<string>("");
  const [endPoint, setEndPoint] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState(false);

  const gates = Object.keys(locations).filter(name => name.includes("Gate"));
  const parkingZones = Object.keys(locations).filter(name => !name.includes("Gate"));

  const routePath = useMemo(() => {
    if (isNavigating && startPoint && endPoint) {
      return [locations[startPoint], locations[endPoint]];
    }
    return [];
  }, [isNavigating, startPoint, endPoint]);

  const handleStartNavigation = () => {
    setIsNavigating(true);
  };

  const handleClear = () => {
    setStartPoint("");
    setEndPoint("");
    setIsNavigating(false);
  };

  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Background Map with dynamic route */}
      <CampusMap route={routePath as any} />

      {/* Floating Routing Panel */}
      <div className="absolute top-24 left-6 sm:left-12 z-20 w-[calc(100%-48px)] sm:w-96 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="glass-panel p-6 sm:p-8 rounded-[2rem] shadow-2xl border-white/10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Route className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-medium">{t("title")}</h1>
              <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>

          {!isNavigating ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">{t("entryGate")}</label>
                <div className="relative">
                  <ArrowDownToLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <select
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-11 pr-4 outline-none focus:border-white/30 transition-colors appearance-none text-sm"
                  >
                    <option value="" disabled className="bg-neutral-900 text-muted-foreground">{t("entryPlaceholder")}</option>
                    {gates.map(gate => (
                      <option key={gate} value={gate} className="bg-neutral-900">{gate}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-px h-6 bg-white/10 mx-auto" />

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-1">{t("destinationZone")}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <select
                    value={endPoint}
                    onChange={(e) => setEndPoint(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-11 pr-4 outline-none focus:border-white/30 transition-colors appearance-none text-sm"
                  >
                    <option value="" disabled className="bg-neutral-900 text-muted-foreground">{t("destinationPlaceholder")}</option>
                    {parkingZones.map(zone => (
                      <option key={zone} value={zone} className="bg-neutral-900">{zone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                disabled={!startPoint || !endPoint}
                onClick={handleStartNavigation}
                className="w-full rounded-xl h-12 bg-white text-black hover:bg-white/90 disabled:opacity-50 mt-4"
              >
                <Navigation className="w-4 h-4 mr-2" /> {t("startRoute")}
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <div className="text-xs text-emerald-400 font-medium mb-1 uppercase tracking-wider">{t("activeRoute")}</div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  <span className="truncate max-w-[120px]">{startPoint}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="truncate max-w-[120px]">{endPoint}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1">{t("distance")}</p>
                  <p className="font-medium text-lg">0.8 km</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-muted-foreground mb-1">{t("estTime")}</p>
                  <p className="font-medium text-lg">3 mins</p>
                </div>
              </div>

              <Button
                onClick={handleClear}
                variant="outline"
                className="w-full rounded-xl h-12 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                {t("endNavigation")}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
