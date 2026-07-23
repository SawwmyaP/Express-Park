"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { Shield, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.endsWith("@srmist.edu.in")) {
      login(email);
      router.push("/");
    } else {
      alert("Please use a valid SRMIST email address");
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-40 px-6 flex items-center justify-center relative overflow-hidden">
      
      {/* Background aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-10 sm:p-14 rounded-[2.5rem] relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white/5 rounded-2xl inline-flex">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-tight mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm font-light">Sign in with your SRM credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email Address (@srmist.edu.in)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-full h-14 pl-12 pr-4 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
            
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-full h-14 pl-12 pr-4 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full h-14 text-lg bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Authenticate
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Mock Admin: admin@srmist.edu.in</p>
          <p>Mock Student: user@srmist.edu.in</p>
        </div>
      </motion.div>
    </main>
  );
}
