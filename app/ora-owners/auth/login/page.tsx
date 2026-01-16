"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 rounded-lg"
      disabled={pending}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Access Control Panel
    </Button>
  );
}

export default function AdminLoginPage() {
  // @ts-ignore
  const [state, dispatch] = useActionState(loginAction, {
    error: "",
    success: false,
  });
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/ora-owners/dashboard");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 font-heading text-foreground">
            Ora Owners
          </h1>
          <p className="text-muted-foreground text-sm">
            Please authenticate to access the command center.
          </p>
        </div>

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
        </form>
      </div>
    </div>
  );
}
