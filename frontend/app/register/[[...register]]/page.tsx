// app/Register.tsx

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";  // Ensure the path is correct based on your project structure
import { useEffect, useState } from "react";

export default function Register() {
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const tokenEndpoint = `${process.env.NEXT_PUBLIC_AUTH_URL}`;

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // Optionally handle user registration logic here
    } catch (error) {
      console.error("Error during Google registration:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Register failed');
      }

      const data = await response.json();
      console.log('Register Status:', data.register_status);
      // Store the token in local storage or context as needed
    } catch (error) {
      console.error('Error during register:', error);
    }
  };

  useEffect(() => {
    // Optional: any Firebase initialization or user state checking can go here
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-background/0 via-background/50 to-background">
      <div className="w-[400px] bg-gradient-to-b p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 border border-white">
        <h1 className="text-3xl font-bold text-center text-transparent px-2 bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">Register</h1>
        <br />
        <form className="space-y-4" onSubmit={handleSubmit}>
        <Input 
            placeholder="Email" 
            className="bg-transparent text-white placeholder:text-gray-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            className="bg-transparent text-white placeholder:text-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="destructive" className="w-full bg-white text-black hover:bg-orange-500 hover:text-white">
            Sign Up
          </Button>
        </form>
        <div className="mt-4">
          <Button 
            onClick={handleGoogleRegister} 
            className="w-full bg-white text-black hover:bg-orange-500 hover:text-white"
          >
            Register with Google
          </Button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account? <a href="/login" className="text-white underline">Login</a>
        </p>
      </div>
    </div>
  );
}
