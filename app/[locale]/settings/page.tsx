"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Globe, Moon, Bell, User, Car, Plus, CheckCircle2, History, LogOut, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

export default function SettingsPage() {
  const { isLoggedIn, name, email, savedVehicles, bookings, addVehicle, removeVehicle, setDefaultVehicle, updateName, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehType, setNewVehType] = useState<"Car" | "Bike">("Car");
  const [newVehReg, setNewVehReg] = useState("");
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(name || "");

  const handleSaveName = () => {
    updateName(editNameValue);
    setIsEditingName(false);
  };

  const handleCycleLanguage = () => {
    const locales = ["en", "ta", "hi"];
    const currentIndex = locales.indexOf(locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];
    router.replace(pathname, { locale: nextLocale });
  };

  const handleAddVehicle = () => {
    if (newVehReg.length > 3) {
      addVehicle({ type: newVehType, regNumber: newVehReg.toUpperCase(), isDefault: false });
      setShowAddVehicle(false);
      setNewVehReg("");
    }
  };

  const activeBooking = bookings.find(b => b.status === "active");
  const pastBookings = bookings.filter(b => b.status === "completed");

  return (
    <main className="min-h-screen pt-24 pb-40 px-6 sm:px-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex justify-between items-end"
      >
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground text-lg font-light">Manage your ExpressPark account</p>
        </div>
        
        {isLoggedIn ? (
          <Button onClick={logout} variant="outline" className="rounded-full border-white/10 hover:bg-white/5 text-muted-foreground">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        ) : (
          <Button onClick={() => router.push("/auth")} className="rounded-full bg-white text-black">
            Sign In
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Preferences */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1 space-y-8"
        >
          {isLoggedIn && (
            <div className="glass-panel p-8 rounded-3xl text-center relative group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <User className="w-10 h-10 text-primary" />
              </div>
              
              {isEditingName ? (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <input 
                    autoFocus
                    value={editNameValue} 
                    onChange={e => setEditNameValue(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-center text-xl font-medium w-32 outline-none"
                  />
                  <Button size="sm" onClick={handleSaveName} className="h-8 px-3 rounded-lg bg-white text-black">Save</Button>
                </div>
              ) : (
                <h2 className="text-2xl font-medium flex items-center justify-center gap-2">
                  {name}
                  <button onClick={() => { setEditNameValue(name || ""); setIsEditingName(true); }} className="text-muted-foreground hover:text-white transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </h2>
              )}
              
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground ml-4 uppercase tracking-wider">Preferences</h3>
            
            <div onClick={handleCycleLanguage} className="glass-panel p-5 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-medium">Language</span>
              </div>
              <span className="text-xs text-muted-foreground bg-white/10 px-2 py-1 rounded-full uppercase">{locale}</span>
            </div>

            <div onClick={() => alert("Light theme is currently disabled to maintain the spatial aesthetic.")} className="glass-panel p-5 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-primary" />
                <span className="font-medium">Theme</span>
              </div>
              <span className="text-xs text-muted-foreground bg-white/10 px-2 py-1 rounded-full">Dark</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-primary" />
                <span className="font-medium">Alerts</span>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">On</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Garage & History */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 space-y-8"
        >
          {isLoggedIn ? (
            <>
              {/* My Garage */}
              <div className="glass-panel p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    My Garage
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowAddVehicle(!showAddVehicle)}
                    className="rounded-full border-white/10 h-8 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>

                <AnimatePresence>
                  {showAddVehicle && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/10">
                        <select 
                          value={newVehType} 
                          onChange={e => setNewVehType(e.target.value as any)}
                          className="bg-transparent border-none outline-none text-sm w-24 appearance-none"
                        >
                          <option className="bg-neutral-900">Car</option>
                          <option className="bg-neutral-900">Bike</option>
                        </select>
                        <div className="w-px h-6 bg-white/10" />
                        <input 
                          type="text" 
                          placeholder="Reg Number" 
                          value={newVehReg}
                          onChange={e => setNewVehReg(e.target.value.toUpperCase())}
                          className="bg-transparent border-none outline-none text-sm flex-1 uppercase"
                        />
                        <Button size="sm" onClick={handleAddVehicle} className="rounded-full bg-white text-black h-8 px-4 text-xs">
                          Save
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {savedVehicles.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No vehicles saved yet.</p>
                  )}
                  {savedVehicles.map(veh => (
                    <div key={veh.id} className={`p-4 rounded-2xl flex justify-between items-center transition-colors border ${veh.isDefault ? "bg-white/10 border-white/30" : "bg-white/5 border-white/5 hover:bg-white/10"}`}>
                      <div className="flex-1 cursor-pointer" onClick={() => setDefaultVehicle(veh.id)}>
                        <p className="font-medium uppercase">{veh.regNumber}</p>
                        <p className="text-xs text-muted-foreground">{veh.type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {veh.isDefault && (
                          <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Default
                          </div>
                        )}
                        <button onClick={() => removeVehicle(veh.id)} className="p-2 text-muted-foreground hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking History */}
              <div className="glass-panel p-8 rounded-3xl">
                <h2 className="text-xl font-medium flex items-center gap-2 mb-6">
                  <History className="w-5 h-5 text-primary" />
                  Booking History
                </h2>

                {activeBooking && (
                  <div className="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-emerald-500/20 transition-colors" onClick={() => router.push("/vehicle")}>
                    <div>
                      <div className="text-xs text-emerald-400 font-medium mb-1 uppercase tracking-wider">Active Now</div>
                      <p className="font-medium text-lg">{activeBooking.location}</p>
                      <p className="text-sm text-muted-foreground">{activeBooking.vehicle} • {activeBooking.duration}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                      →
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Past Bookings</h3>
                  {pastBookings.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No past bookings found.</p>
                  )}
                  {pastBookings.map(b => (
                    <div key={b.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center opacity-70">
                      <div>
                        <p className="font-medium">{b.location}</p>
                        <p className="text-xs text-muted-foreground">{b.vehicle} • {new Date(b.date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs text-muted-foreground px-2 py-1 bg-white/10 rounded-full">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center h-full">
              <User className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Sign in required</h3>
              <p className="text-muted-foreground text-sm mb-6">Sign in to manage your digital garage and view your parking history.</p>
              <Button onClick={() => router.push("/auth")} className="rounded-full bg-white text-black px-8">
                Sign In
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
