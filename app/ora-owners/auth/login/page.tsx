"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { adminLoginAction, resetAdminPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert, KeyRound, ArrowLeft } from "lucide-react";

function SubmitButton({ text = "Access Control Panel" }: { text?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 rounded-lg"
      disabled={pending}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {text}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [isResetMode, setIsResetMode] = useState(false);
  // @ts-expect-error
  const [state, dispatch] = useActionState(adminLoginAction, {
    error: "",
    success: false,
  });

  // @ts-expect-error
  const [resetState, resetDispatch] = useActionState(resetAdminPassword, {
    error: "",
    success: false,
  });

  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/ora-owners/dashboard");
    }
  }, [state, router]);

  useEffect(() => {
    if (resetState?.success) {
      setIsResetMode(false);
    }
  }, [resetState]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
            {isResetMode ? <KeyRound size={32} /> : <ShieldAlert size={32} />}
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 font-heading text-foreground">
            {isResetMode ? "Emergency Reset" : "Ora Owners"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isResetMode
              ? "Enter recovery code from database."
              : "Please authenticate to access the command center."}
          </p>
        </div>

        {resetState?.success && !isResetMode && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm text-center">
            Password reset successful. Please login.
          </div>
        )}

        {isResetMode ? (
          <form action={resetDispatch} className="space-y-6">
            {resetState.error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
                {resetState.error}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-foreground">Email Address</Label>
              <Input
                name="email"
                type="email"
                placeholder="admin@ora.lk"
                required
                className="bg-background border-input focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Recovery Code</Label>
              <Input
                name="recoveryCode"
                type="text"
                placeholder="Enter recovery code"
                required
                className="bg-background border-input focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">New Password</Label>
              <Input
                name="newPassword"
                type="password"
                required
                className="bg-background border-input focus:ring-primary focus:border-primary text-foreground h-12"
              />
            </div>

            <SubmitButton text="Reset Password" />
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsResetMode(false)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Button>
          </form>
        ) : (
          <form action={dispatch} className="space-y-6">
            {state.error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
                {state.error}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-foreground">Email Address</Label>
              <Input
                name="email"
                type="email"
                placeholder="admin@ora.lk"
                required
                className="bg-background border-input focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Password</Label>
              <Input
                name="password"
                type="password"
                required
                className="bg-background border-input focus:ring-primary focus:border-primary text-foreground h-12"
              />
            </div>

            <SubmitButton />
            <Button
              type="button"
              variant="link"
              className="w-full text-muted-foreground text-sm"
              onClick={() => setIsResetMode(true)}
            >
              Emergency Reset
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
