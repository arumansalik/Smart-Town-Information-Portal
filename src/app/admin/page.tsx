"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = () => {
        if (email === "admin@gmail.com" && password === "1234") {
            localStorage.setItem("admin", "true");
            router.push("/admin/dashboard");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4">

                <h1 className="text-xl font-bold text-center">Admin Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 rounded-lg"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-primary text-white py-3 rounded-lg"
                >
                    Login
                </button>

            </div>

        </div>
    );
}