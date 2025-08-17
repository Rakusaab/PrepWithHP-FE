"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, User, BookOpen, TrendingUp, ArrowRight, MailWarning } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import React, { useState } from "react";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const [resent, setResent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const user = session?.user as any;
  // Use correct session property names (camelCase)
  const needsActivation = user && (!user.isEmailVerified || !user.isActive);
  const [reloadKey, setReloadKey] = useState(0);


  const handleResend = async () => {
    setResendLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/auth/resend-activation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      if (res.ok) {
        setResent(true);
      } else {
        setResent(false);
        alert('Failed to resend activation email. Please try again.');
      }
    } catch (e) {
      setResent(false);
      alert('Failed to resend activation email. Please try again.');
    }
    setResendLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your onboarding...</p>
        </div>
      </div>
    );
  }

  if (needsActivation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
        <Card className="w-full max-w-lg shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <MailWarning className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold text-gray-900">Activate Your Account</CardTitle>
            <CardDescription className="text-md text-gray-600">
              Your account has been created, but activation is required.<br />
              Please check your email (<span className="font-semibold">{user.email}</span>) for the activation link.<br />
              If you did not receive the email, you can resend it below.<br />
              <span className="text-xs text-gray-500 block mt-2">If you have already activated, please reload your session or log in again.</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Button onClick={handleResend} disabled={resent || resendLoading} className="w-full md:w-2/3 text-lg font-semibold">
              {resendLoading ? "Resending..." : resent ? "Activation Email Sent" : "Resend Activation Email"}
            </Button>
            {resent && <p className="text-green-600 text-sm">Activation email sent! Please check your inbox.</p>}
            <div className="flex flex-col items-center space-y-2 w-full mt-2">
              <Button variant="outline" className="w-full md:w-2/3" onClick={() => window.location.reload()}>Reload Session</Button>
              <Button variant="ghost" className="w-full md:w-2/3" onClick={() => signOut({ callbackUrl: '/auth/login' })}>Log in Again</Button>
            </div>
            <p className="text-xs text-gray-400">Contact support if you continue to have issues activating your account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default onboarding content
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="text-center space-y-2">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome to PrepWithAI!</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your account has been created. Let's get you set up for success.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <User className="h-8 w-8 text-primary-600" />
              <span className="font-semibold text-gray-800">Complete Profile</span>
              <span className="text-xs text-gray-500">Add your exam preferences and details to personalize your experience.</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="font-semibold text-gray-800">Explore Study Material</span>
              <span className="text-xs text-gray-500">Access curated resources and practice questions for your target exams.</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="font-semibold text-gray-800">Track Progress</span>
              <span className="text-xs text-gray-500">Monitor your performance and get AI-powered insights to improve.</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center space-y-4">
            <Button asChild className="w-full md:w-2/3 text-lg font-semibold">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-gray-400">You can update your profile and preferences anytime from your dashboard.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
