"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }
    const verify = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Your email has been verified! Redirecting to login...");
          // Automatically sign out and redirect to login to refresh session
          setTimeout(() => {
            signOut({ callbackUrl: "/auth/login" });
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.detail || "Verification failed. Token may be invalid or expired.");
        }
      } catch (e) {
        setStatus("error");
        setMessage("An error occurred while verifying your email.");
      }
    };
    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="text-center space-y-2">
          {status === "success" ? (
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          ) : status === "error" ? (
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          ) : null}
          <CardTitle className="text-2xl font-bold text-gray-900">
            {status === "pending"
              ? "Verifying Email..."
              : status === "success"
              ? "Email Verified"
              : "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-md text-gray-600">{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "success" && (
            <Button onClick={() => signOut({ callbackUrl: "/auth/login" })}>Go to Login</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
