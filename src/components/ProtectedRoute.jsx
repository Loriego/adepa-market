import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-black">Checking account...</h1>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}