"use client";

import { motion } from "framer-motion";
import { AlertCircle, Car, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function WorkspacePage() {
  const { role, isLoggedIn, name, email, bookings, cancelBooking } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && role !== "security") {
      router.push("/");
    }
  }, [role, isLoggedIn, router]);

  // Mock data for the Security Dashboard
  const trafficLogs = [
    { id: 1, vehicle: "TN-11-AB-1234", type: "Car", time: "09:12 AM", status: "entered", isMessy: false },
    { id: 2, vehicle: "TN-22-CD-5678", type: "Bike", time: "09:15 AM", status: "entered", isMessy: true },
    { id: 3, vehicle: "TN-33-EF-9012", type: "Car", time: "09:20 AM", status: "exited", isMessy: false },
    { id: 4, vehicle: "TN-44-GH-3456", type: "Cycle", time: "09:25 AM", status: "entered", isMessy: false },
  ];

  const [mockBookings, setMockBookings] = useState([
    { id: 101, name: "Arjun Kumar", email: "arjun@srmist.edu.in", vehicle: "TN-11-AB-1234", type: "Car", zone: "Tech Park", time: "4 Hours", status: "active" },
    { id: 102, name: "Priya Singh", email: "priya@srmist.edu.in", vehicle: "TN-22-CD-5678", type: "Bike", zone: "UB", time: "2 Hours", status: "active" },
    { id: 103, name: "Rahul Verma", email: "rahul@srmist.edu.in", vehicle: "TN-33-EF-9012", type: "Car", zone: "Main Campus", time: "8 Hours", status: "completed" },
    { id: 104, name: "Neha Reddy", email: "neha@srmist.edu.in", vehicle: "TN-44-GH-3456", type: "Cycle", zone: "Tech Park", time: "4 Hours", status: "active" },
  ]);

  // Mock global bookings for the Admin View + Current user's bookings
  const globalBookings = [
    ...bookings.map(b => ({
      id: b.id,
      name: name || "Admin User",
      email: email || "admin@srmist.edu.in",
      vehicle: b.vehicle,
      type: "Car", // fallback
      zone: b.location,
      time: b.duration,
      status: b.status
    })),
    ...mockBookings
  ];

  const handleCancelBooking = (id: string | number) => {
    if (typeof id === "string") {
      cancelBooking(id);
    } else {
      setMockBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    }
  };

  if (!isLoggedIn || role !== "security") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-40 px-6 sm:px-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
      >
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-2">Workspace</h1>
          <p className="text-muted-foreground text-lg font-light">Campus Traffic & Security Operations</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">System Secure</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column: Alerts & AI Analysis */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-8"
        >
          <div className="glass-panel p-8 rounded-[2rem]">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-medium">Messy Vehicles</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              YOLO vision systems have flagged these vehicles for improper parking order.
            </p>
            
            <div className="space-y-4">
              {trafficLogs.filter(log => log.isMessy).map(log => (
                <div key={log.id} className="p-4 bg-white/5 rounded-2xl border border-amber-500/20">
                  <p className="font-medium text-amber-400 mb-1">{log.vehicle}</p>
                  <p className="text-xs text-muted-foreground">Spotted at {log.time} in Tech Park Zone</p>
                </div>
              ))}
              {trafficLogs.filter(log => log.isMessy).length === 0 && (
                <p className="text-sm text-emerald-400">All vehicles parked correctly.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Traffic Flow */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glass-panel p-8 rounded-[2rem] h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-medium">Live Traffic Stream</h2>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search plates..." 
                  className="bg-transparent border-none outline-none text-sm w-32 placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-4 mb-4 border-b border-white/10">
                <span>Vehicle</span>
                <span>Type</span>
                <span>Time</span>
                <span>Status</span>
              </div>
              
              <div className="space-y-2">
                {trafficLogs.map((log, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    key={log.id} 
                    className="grid grid-cols-4 items-center p-3 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <span className="font-medium text-sm">{log.vehicle}</span>
                    <span className="text-sm text-muted-foreground">{log.type}</span>
                    <span className="text-sm text-muted-foreground">{log.time}</span>
                    <span className="text-sm">
                      {log.status === "entered" ? (
                        <span className="text-emerald-400">Entered</span>
                      ) : (
                        <span className="text-muted-foreground">Exited</span>
                      )}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Width: Global Bookings Ledger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <div className="glass-panel p-8 rounded-[2rem]">
          <h2 className="text-xl font-medium mb-6">Global Reservations Ledger</h2>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-4 mb-4 border-b border-white/10">
                <span>User</span>
                <span>Email</span>
                <span>Vehicle</span>
                <span>Type</span>
                <span>Zone</span>
                <span>Status</span>
              </div>
              
              <div className="space-y-2">
                {globalBookings.map((booking, i) => (
                  <div 
                    key={booking.id} 
                    className="grid grid-cols-6 items-center p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"
                  >
                    <span className="font-medium text-sm">{booking.name}</span>
                    <span className="text-sm text-muted-foreground">{booking.email}</span>
                    <span className="text-sm font-medium uppercase">{booking.vehicle}</span>
                    <span className="text-sm text-muted-foreground">{booking.type}</span>
                    <span className="text-sm text-muted-foreground">{booking.zone}</span>
                    <span className="text-sm">
                      {booking.status === "active" ? (
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </span>
                          <button onClick={() => handleCancelBooking(booking.id)} className="text-xs text-red-400 hover:text-red-300">
                            Cancel
                          </button>
                        </div>
                      ) : booking.status === "completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-muted-foreground text-xs font-medium">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
                          Cancelled
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </main>
  );
}
