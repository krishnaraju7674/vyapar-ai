import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Key, CheckCircle, XCircle } from "lucide-react";

export default function ResetPassword({ apiUrl }: { apiUrl: string }) {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900/40 border border-neutral-800 rounded-2xl p-8 space-y-6">
        {success ? (
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
            <h2 className="text-xl font-bold">Password Reset Successful</h2>
            <p className="text-sm text-neutral-400">You can now log in with your new password.</p>
            <Link to="/history" className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold px-6 py-2 rounded-lg text-sm transition-colors">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <Key className="w-8 h-8 text-orange-500 mx-auto" />
              <h2 className="text-xl font-bold">Reset Your Password</h2>
              <p className="text-xs text-neutral-400">Enter your new password below.</p>
            </div>
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/40 text-red-400 text-xs rounded-lg flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
              />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-700"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}