// app/Login.tsx

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";  // Ensure the path is correct based on your project structure
import { useEffect } from "react";

export default function Login() {
  const { theme } = useTheme();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  useEffect(() => {
    // Optional: any Firebase initialization or user state checking can go here
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-background/0 via-background/50 to-background">
      <div className="w-[400px] bg-gradient-to-b p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-white">
        <h1 className="text-3xl font-bold text-center text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">Login</h1>
        <br />
        <form className="space-y-4">
          <Input placeholder="Email" className="bg-transparent text-white placeholder:text-gray-300" />
          <Input type="password" placeholder="Password" className="bg-transparent text-white placeholder:text-gray-300" />
          <Button type="submit" variant="destructive" className="w-full bg-white text-white hover:bg-orange-500 hover:text-white">
            Sign In
          </Button>
        </form>
        <div className="mt-4">
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full bg-white text-black hover:bg-orange-500 hover:text-white"
          >
            Login with Google
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-300">
          Don't have an account? <a href="/register" className="text-white underline">Register</a>
        </p>
      </div>
    </div>
  );
}
