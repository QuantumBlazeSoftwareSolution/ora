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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        {/* Header content unchanged... */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 border border-rose-500/20">
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Restricted Area
          </h1>
          <p className="text-neutral-500 text-sm">
            Authorized personnel only. All access is logged.
          </p>
        </div>

        <form action={dispatch} className="space-y-6">
          {state.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
              {state.error}
            </div>
          )}
          {/* Hidden input to ensure logic knows its admin if needed, 
              but standard loginAction handles email/pass. 
              We rely on redirect logic in user role.
           */}
          <div className="space-y-2">
            <Label className="text-neutral-300">Command Key (Email)</Label>
            <Input
              name="email"
              type="email"
              placeholder="admin@ora.lk"
              required
              className="bg-neutral-950 border-neutral-800 focus:ring-rose-500 focus:border-rose-500 text-white placeholder:text-neutral-700 h-12"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-300">Passcode</Label>
            <Input
              name="password"
              type="password"
              required
              className="bg-neutral-950 border-neutral-800 focus:ring-rose-500 focus:border-rose-500 text-white h-12"
            />
          </div>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
