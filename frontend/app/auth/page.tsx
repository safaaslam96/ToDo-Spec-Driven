"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";

export default function AuthPage() {
  const [userId, setUserId] = useState("test-user-123");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsLoading(true);
    
    // Generate a test JWT token (this is just for MVP testing)
    // In production, this would come from Better Auth
    const testToken = await fetch("/api/test-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((r) => r.json())
      .then((data) => data.token)
      .catch(() => {
        // Fallback: create a simple test token
        return `test.${btoa(JSON.stringify({ sub: userId }))}.signature`;
      });

    localStorage.setItem("auth_token", testToken);
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Sign In (Test Mode)
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          This is a test authentication page. In production, this would use Better Auth.
          For now, enter any user ID to generate a test token.
        </p>

        <div className="space-y-4">
          <Input
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="test-user-123"
            helperText="Any string will work as a test user ID"
          />

          <Button
            variant="primary"
            className="w-full"
            onClick={handleSignIn}
            loading={isLoading}
            disabled={!userId.trim()}
          >
            Sign In
          </Button>

          <p className="text-center text-xs text-gray-500">
            Note: This generates a client-side test token. Backend JWT
            verification is implemented but this is for demonstration only.
          </p>
        </div>
      </div>
    </main>
  );
}
