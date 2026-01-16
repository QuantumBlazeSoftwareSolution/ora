"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";
import { setupPassword } from "@/app/actions/auth/verify";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<"verifying" | "input" | "success">(
    "input"
  );

  // In a real app, we might verify token validity on mount via a server action.
  // For MVP, we verify when submitting password.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid verification link.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);
    try {
      const res = await setupPassword(token, password);
      if (res.success) {
        setStatus("success");
        setTimeout(() => {
          router.push("/business/login");
        }, 2000);
      } else {
        setError(res.error || "Verification failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="bg-card p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h1 className="text-xl font-bold text-destructive mb-2">
            Invalid Link
          </h1>
          <p className="text-muted-foreground">
            This verification link is missing a token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="bg-card w-full max-w-md p-8 rounded-3xl shadow-xl border border-border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-2xl font-bold font-heading">
            Secure Your Account
          </h1>
          <p className="text-muted-foreground">
            Set a password to access your dashboard.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center text-emerald-500 font-bold animate-in zoom-in">
            <p>Password set successfully!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="rounded-xl"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive font-medium text-center bg-destructive/10 p-2 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-bold"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="mr-2 animate-spin" /> : null}
              Set Password & Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
