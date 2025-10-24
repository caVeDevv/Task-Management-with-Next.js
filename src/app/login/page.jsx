"use client";

import { userAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";

import users from "../../data/users.json";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Login() {
  const router = useRouter();
  const { login } = userAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eye, setEye] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const right = users.find(
      (u) => u.email === email && u.password === password
    );

    if (right) {
      login(right);
      toast.success("Logged in successfully", {
        style: {
          background: "#008080",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
      router.push("/dashboard");
    } else {
      setLoading(false);
      toast.error("Please check your credentials", {
        style: {
          background: "#dc3545",
          color: "white",
          fontSize: "15px",
          border: "none",
        },
      });
      setError("Invalid email or password");
    }
  };

  const Home = () => {
    router.push("/");
  };

  return (
    <div className="bg-black h-screen flex flex-col items-center justify-center text-center">
      <Card className="md:p-3 text-[#000938] w-11/12 h-[440px] mx-auto md:max-w-[500px] md:min-h-[500px] flex items-center justify-center ">
        <CardHeader className="w-full">
          <CardTitle className="flex flex-col items-center justify-center">
            <div className=" w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <p className="mt-2 md:mt-4 text-base md:font-semibold">Login</p>
          </CardTitle>

          <CardDescription className="text-left mt-0 md:mt-2">
            Enter your details below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <form name="signup" id="signup" onSubmit={handleLogin}>
            <div className="flex flex-col gap-4 md:gap-6 ">
              <div className="grid gap-2 text-sm md:text-base">
                <div className="flex ">
                  <label htmlFor="email">Email</label>
                </div>

                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  name="email"
                  className="caret-black rounded w-full text-gray-700 border border-gray-500 focus:outline-2  p-2"
                  placeholder="user1@example.com"
                  required
                />
              </div>
              <div className="grid gap-2 text-sm md:text-base">
                <div className="flex items-center">
                  <label htmlFor="password">Password</label>
                </div>

                <div
                  tabIndex={0}
                  className="flex items-center flex-row justify-center w-full rounded border border-gray-500 focus:outline-2"
                >
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={eye ? "text" : "password"}
                    className="caret-black rounded w-11/12 text-gray-700 border-none focus:outline-none  p-2"
                    required
                  />
                  {eye ? (
                    <Eye
                      className="mr-2 cursor-pointer"
                      strokeWidth={1}
                      size={18}
                      onClick={() => setEye(false)}
                    />
                  ) : (
                    <EyeOff
                      className="mr-2 cursor-pointer"
                      strokeWidth={1}
                      size={18}
                      onClick={() => setEye(true)}
                    />
                  )}
                </div>
                {error && (
                  <p className="text-start text-xs md:text-sm text-red-500">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-1 w-full ">
          <Button
            type="submit"
            form="signup"
            disabled={loading}
            className="w-full cursor-pointer !bg-slate hover:!bg-text-[#000938] text-white rounded-sm p-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                logging in
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </>
            ) : (
              "Login"
            )}
          </Button>
          <Button
            className="w-full cursor-pointer !bg-gray-300 hover:!bg-text-white text-[#000938] rounded-sm p-4 flex items-center justify-center gap-2"
            onClick={Home}
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default Login;
