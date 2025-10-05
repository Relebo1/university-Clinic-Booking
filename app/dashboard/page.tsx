'use client';

import { useEffect, useState } from "react";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { NurseDashboard } from "@/components/dashboard/nurse-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { Navbar } from "@/components/layout/navbar";
import ProtectedRoute from "@/components/layout/protected-route";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case "student":
      case "staff":
        return <StudentDashboard />;
      case "nurse":
        return <NurseDashboard />;
      case "administrator":
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <ProtectedRoute requiredRole={["student", "staff", "nurse", "administrator"]}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? <p>Loading dashboard...</p> : renderDashboard()}
        </main>
      </div>
    </ProtectedRoute>
  );
}
