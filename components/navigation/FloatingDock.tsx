"use client";

import { motion } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import { Map, Navigation, Car, LayoutDashboard, Settings, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { useAuth } from "@/components/auth/AuthProvider";

export function FloatingDock() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);
  const { role } = useAuth();

  // Scroll aware shrinking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { icon: Map, label: t("map"), href: "/" },
    { icon: Navigation, label: t("routing"), href: "/routing" },
    { icon: Car, label: t("vehicle"), href: "/vehicle" },
    { icon: Zap, label: t("surge"), href: "/surge" },
    // Only show Workspace if the user is a security admin
    ...(role === "security" ? [{ icon: LayoutDashboard, label: t("workspace"), href: "/workspace" }] : []),
    { icon: Settings, label: t("settings"), href: "/settings" },
  ];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
    >
      <motion.nav 
        animate={{
          scale: scrolled ? 0.9 : 1,
          padding: scrolled ? "0.5rem" : "0.75rem"
        }}
        className="glass-panel rounded-full flex items-center gap-2"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href as any}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center justify-center p-3 rounded-full transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
              </motion.div>
            </Link>
          );
        })}
      </motion.nav>
    </motion.div>
  );
}
