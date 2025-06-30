"use client";

import { Button } from "@repo/ui/button";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-4 m-2 bg-white rounded text-black">
        <div className="p-2">
          <input
            className="border p-1 rounded"
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="p-2">
          <input
            className="border p-1 rounded"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="p-2">
          <Button
            size="lg"
            variant="primary"
            className="p-2 px-4 rounded-4xl bg-indigo-700 w-full text-white"
          >
            {isSignin ? "Sign in " : "Sign up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
