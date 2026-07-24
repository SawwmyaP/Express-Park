"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Car, Bike, Navigation, MapPin, Clock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function VehiclePage() {
  const { isLoggedIn, savedVehicles, addBooking } = useAuth();
  const router = useRouter();
  const t = useTranslations("VehiclePage");

  // Multi-step form state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Data
  const [vehicleType, setVehicleType] = useState<"Car" | "Bike" | "Cycle" | null>(null);
  const [regNumber, setRegNumber] = useState("");
  const [zone, setZone] = useState<string>("");
  const [duration, setDuration] = useState<string>("4 Hours");
  const [qrHash, setQrHash] = useState<string | null>(null);

  // Auto-fill from default vehicle on mount
  useEffect(() => {
    const defaultVeh = savedVehicles.find(v => v.isDefault);
    if (defaultVeh && !vehicleType && !regNumber) {
      setVehicleType(defaultVeh.type);
      setRegNumber(defaultVeh.regNumber);
    }
  }, [savedVehicles]);

  // If not logged in, show a prompt to login
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen pt-24 pb-40 px-6 sm:px-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 text-center rounded-[2rem] max-w-md w-full"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-light mb-4">{t("authRequired")}</h2>
          <p className="text-muted-foreground mb-8">
            {t("authPrompt")}
          </p>
          <Button 
            onClick={() => router.push("/auth")}
            className="w-full rounded-full h-12 bg-white text-black hover:bg-white/90"
          >
            {t("signIn")}
          </Button>
        </motion.div>
      </main>
    );
  }

  const handleGenerateTicket = () => {
    // Generate a mock hash representing the ticket in the database
    const mockHash = btoa(`${vehicleType}-${regNumber}-${zone}-${Date.now()}`);
    setQrHash(mockHash);
    
    // Save booking to context history
    addBooking({
      location: zone,
      duration: duration,
      vehicle: regNumber
    });
    
    setStep(3);
  };

  return (
    <main className="min-h-screen pt-24 pb-40 px-6 sm:px-12 max-w-4xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-12"
      >
        <h1 className="text-4xl font-light tracking-tight mb-3">{t("title")}</h1>
        <p className="text-muted-foreground text-lg font-light">
          {step === 1 && t("step1")}
          {step === 2 && t("step2")}
          {step === 3 && t("step3")}
        </p>
      </motion.div>

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Vehicle Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-[2rem] space-y-6"
            >
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">{t("selectVehicleType")}</label>
                <div className="grid grid-cols-3 gap-4">
                  {["Car", "Bike", "Cycle"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setVehicleType(type as any)}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-colors ${
                        vehicleType === type 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      {type === "Car" ? <Car className="w-6 h-6" /> : <Bike className="w-6 h-6" />}
                      <span className="text-sm font-medium">{type === "Car" ? t("car") : type === "Bike" ? t("bike") : t("cycle")}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("regNumberLabel")}</label>
                <input
                  type="text"
                  placeholder={t("regNumberPlaceholder")}
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                  className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-4 outline-none focus:border-white/30 transition-colors uppercase"
                />
              </div>

              <Button 
                disabled={!vehicleType || regNumber.length < 4}
                onClick={() => setStep(2)}
                className="w-full rounded-full h-12 bg-white text-black hover:bg-white/90 disabled:opacity-50"
              >
                {t("continueBtn")}
              </Button>
            </motion.div>
          )}

          {/* STEP 2: Location & Duration */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="glass-panel p-8 rounded-[2rem] space-y-6"
            >
              <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">{t("zoneLabel")}</label>
                <div className="space-y-2">
                  {["Tech Park", "University Building", "Main Campus"].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setZone(loc)}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-colors ${
                        zone === loc 
                          ? "bg-white/10 border-white/30 text-white" 
                          : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      <span className="font-medium">{loc}</span>
                      <MapPin className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t("durationLabel")}</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl h-14 px-4 outline-none focus:border-white/30 transition-colors appearance-none"
                >
                  <option className="bg-neutral-900" value="2 Hours">{t("twoHours")}</option>
                  <option className="bg-neutral-900" value="4 Hours">{t("fourHours")}</option>
                  <option className="bg-neutral-900" value="Full Day (8 Hours)">{t("fullDay")}</option>
                </select>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 rounded-full h-12 border-white/10 hover:bg-white/5"
                >
                  {t("backBtn")}
                </Button>
                <Button 
                  disabled={!zone}
                  onClick={handleGenerateTicket}
                  className="w-2/3 rounded-full h-12 bg-white text-black hover:bg-white/90 disabled:opacity-50"
                >
                  {t("confirmBtn")}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: QR Code Ticket */}
          {step === 3 && qrHash && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8 rounded-[2rem] flex flex-col items-center border border-emerald-500/20"
            >
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-400">
                {t("gatePassActive")}
              </div>

              <div className="bg-white p-6 rounded-3xl mb-8 shadow-2xl">
                <QRCodeSVG 
                  value={qrHash} 
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#171717"
                />
              </div>

              <div className="w-full space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("vehicleLabel")}</p>
                      <p className="font-medium uppercase">{regNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{t("typeLabel")}</p>
                    <p className="font-medium text-emerald-400">{vehicleType === "Car" ? t("car") : vehicleType === "Bike" ? t("bike") : t("cycle")}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("locationLabel")}</p>
                    <p className="text-sm">{zone} Zone</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("durationLabel")}</p>
                    <p className="text-sm">{duration === "2 Hours" ? t("twoHours") : duration === "4 Hours" ? t("fourHours") : t("fullDay")} {t("durationPermitted")}</p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(1)}
                className="w-full rounded-full h-12 bg-white/10 text-white hover:bg-white/20 border border-white/5"
              >
                {t("bookAnother")}
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
