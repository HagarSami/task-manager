"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseconfig"; // Import Firebase auth and firestore

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);

      // Fetch the user's data from Firestore
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        // Save user's name and tasks to localStorage (for easy access in the Welcome page)
        localStorage.setItem("userName", userData.firstName);
        localStorage.setItem("userTasks", JSON.stringify(userData.tasks));

        // Redirect to the welcome page
        router.push("/welcome");
      } else {
        setError("No user found!");
      }
    } catch (error) {
      setError("Invalid credentials.");
    }
  };

  const handleGoToSignUp = () => {
    router.push("/signup"); // Redirect to sign-up page if the user doesn't have an account
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-3xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 mb-6">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-purple-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleGoToSignUp}
            className="text-pink-500 hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

