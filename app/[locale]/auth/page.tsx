"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "@/i18n/routing";
import { Shield, KeyRound, Mail, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, Role } from "@/components/auth/AuthProvider";
import { useTranslations } from "next-intl";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<Role>("student");
  const [error, setError] = useState("");
  
  const { login, signup } = useAuth();
  const router = useRouter();
  const t = useTranslations("AuthPage");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.endsWith("@srmist.edu.in")) {
      setError(t("invalidEmailDomain"));
      return;
    }

    if (isSignUp) {
      const result = signup(email, password, userRole);
      if (result === "success") {
        router.push("/");
      } else if (result === "unauthorized_admin") {
        setError(t("unauthorizedAdmin"));
      } else {
        setError(t("userExists"));
      }
    } else {
      const success = login(email, password);
      if (success) {
        router.push("/");
      } else {
        setError(t("invalidCredentials"));
      }
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
          <h1 className="text-3xl font-light tracking-tight mb-2">{isSignUp ? t("signUpTitle") : t("title")}</h1>
          <p className="text-muted-foreground text-sm font-light">{isSignUp ? t("signUpSubtitle") : t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            {isSignUp && (
              <div className="relative flex gap-4 bg-white/5 p-1 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => setUserRole("student")}
                  className={`flex-1 py-2 text-sm rounded-full transition-colors ${userRole === "student" ? "bg-white text-black" : "text-muted-foreground hover:text-white"}`}
                >
                  {t("roleStudent")}
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("security")}
                  className={`flex-1 py-2 text-sm rounded-full transition-colors ${userRole === "security" ? "bg-white text-black" : "text-muted-foreground hover:text-white"}`}
                >
                  {t("roleSecurity")}
                </button>
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder={t("emailPlaceholder")}
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
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-full h-14 pl-12 pr-4 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <Button type="submit" className="w-full rounded-full h-14 text-lg bg-white text-black hover:bg-white/90 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {isSignUp ? t("signUpBtn") : t("authenticateBtn")}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <p>
              {t("alreadyHaveAccount")}{" "}
              <button onClick={() => { setIsSignUp(false); setError(""); }} className="text-primary hover:underline">
                {t("signInInstead")}
              </button>
            </p>
          ) : (
            <p>
              {t("dontHaveAccount")}{" "}
              <button onClick={() => { setIsSignUp(true); setError(""); }} className="text-primary hover:underline">
                {t("createOne")}
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
}
