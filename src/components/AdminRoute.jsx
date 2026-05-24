import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-black">Checking admin access...</h1>
      </main>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" />;
  }

  return children;
}