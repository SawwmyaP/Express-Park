"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role = "student" | "security" | null;

export type Vehicle = {
  id: string;
  type: "Car" | "Bike" | "Cycle";
  regNumber: string;
  isDefault: boolean;
};

export type Booking = {
  id: string;
  location: string;
  duration: string;
  date: string;
  status: "active" | "completed" | "cancelled";
  vehicle: string;
};

interface AuthContextType {
  isLoggedIn: boolean;
  email: string | null;
  name: string | null;
  role: Role;
  savedVehicles: Vehicle[];
  bookings: Booking[];
  login: (email: string) => void;
  logout: () => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  removeVehicle: (id: string) => void;
  setDefaultVehicle: (id: string) => void;
  addBooking: (booking: Omit<Booking, "id" | "date" | "status">) => void;
  cancelBooking: (id: string) => void;
  updateName: (newName: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  email: null,
  name: null,
  role: null,
  savedVehicles: [],
  bookings: [],
  login: () => {},
  logout: () => {},
  addVehicle: () => {},
  removeVehicle: () => {},
  setDefaultVehicle: () => {},
  addBooking: () => {},
  cancelBooking: () => {},
  updateName: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  
  const [savedVehicles, setSavedVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const router = useRouter();

  // Load from local storage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("expresspark_auth");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      setIsLoggedIn(parsed.isLoggedIn);
      setEmail(parsed.email);
      setName(parsed.name || parsed.email?.split("@")[0]);
      setRole(parsed.role);
      setSavedVehicles(parsed.savedVehicles || []);
      setBookings(parsed.bookings || []);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("expresspark_auth", JSON.stringify({
        isLoggedIn, email, name, role, savedVehicles, bookings
      }));
    }
  }, [isLoggedIn, email, name, role, savedVehicles, bookings]);

  const login = (userEmail: string) => {
    const userRole: Role = userEmail.includes("security") || userEmail.includes("admin") ? "security" : "student";
    const userName = userEmail.split("@")[0].replace(/[0-9]/g, '');
    const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    
    setIsLoggedIn(true);
    setEmail(userEmail);
    setName(capitalizedName);
    setRole(userRole);
    
    // Seed some mock data if empty
    setSavedVehicles([
      { id: "1", type: "Car", regNumber: "TN-11-AB-1234", isDefault: true }
    ]);
    setBookings([
      { id: "b1", location: "Tech Park", duration: "4 Hours", date: new Date(Date.now() - 86400000).toISOString(), status: "completed", vehicle: "TN-11-AB-1234" }
    ]);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setEmail(null);
    setName(null);
    setRole(null);
    setSavedVehicles([]);
    setBookings([]);
    localStorage.removeItem("expresspark_auth");
    router.push("/");
  };

  const addVehicle = (vehicleData: Omit<Vehicle, "id">) => {
    const newVehicle = { ...vehicleData, id: Date.now().toString() };
    
    setSavedVehicles(prev => {
      // If it's the first vehicle or marked as default, unset others
      let next = [...prev];
      if (next.length === 0 || newVehicle.isDefault) {
        next = next.map(v => ({ ...v, isDefault: false }));
        newVehicle.isDefault = true;
      }
      return [...next, newVehicle];
    });
  };

  const setDefaultVehicle = (id: string) => {
    setSavedVehicles(prev => prev.map(v => ({
      ...v,
      isDefault: v.id === id
    })));
  };

  const removeVehicle = (id: string) => {
    setSavedVehicles(prev => prev.filter(v => v.id !== id));
  };

  const updateName = (newName: string) => {
    setName(newName);
  };

  const addBooking = (bookingData: Omit<Booking, "id" | "date" | "status">) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: "active"
    };
    
    // Convert previous active bookings to completed
    setBookings(prev => {
      const updated = prev.map(b => b.status === "active" ? { ...b, status: "completed" as const } : b);
      return [newBooking, ...updated];
    });
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b));
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, email, name, role, savedVehicles, bookings, 
      login, logout, addVehicle, removeVehicle, setDefaultVehicle, addBooking, cancelBooking, updateName 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
