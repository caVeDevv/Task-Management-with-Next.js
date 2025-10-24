"use client";

import { userAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProtectedRoute({ children }) {
  const { user, loading } = userAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("You must be logged in to access this page", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="font-bold text-white">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="font-bold text-white">Redirecting ...</p>
      </div>
    );
  }

  return <>{children}</>;
}
