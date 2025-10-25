"use client";

import { useRouter } from "next/navigation";
import main from "./main.png";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const handleGetStarted = () => {
    router.push("/login");
  };
  return (
    <>
      <div className="w-full min-h-screen h-full bg-black flex flex-col">
        <div className="text-white/80 leading-wide w-11/12 md:w-10/12 mx-auto text-2xl md:text-4xl font-bold text-center mt-20 mb-8">
          <h2 className=" text-4xl mb-4">
            Welcome to <span className="text-cyan-400">Task-M</span>{" "}
          </h2>
          <p className="text-white/70">
            Your All-In-One Task Management System
          </p>
          <div className="mt-4 text-sm md:text-base text-white/50">
            <button
              onClick={handleGetStarted}
              className="bg-transparent cursor-pointer border-2 border-white text-white hover:bg-white hover:text-black transition-all px-5 py-3 text-lg rounded-full mt-7"
            >
              Get started
            </button>
          </div>
        </div>

        <div
          className=" relative
  flex-1 
  w-11/12 md:w-10/12 
  mx-auto 
  text-center 
  border border-gray-50 
  rounded-t-3xl rounded-b-none 
  shadow-lg 
  flex flex-col p-3 bg-cover bg-center items-center justify-center
"
        >
          <Image
            className="object-cover rounded-2xl rounded-b-none w-full h-auto object cover"
            src={main}
            width={2000}
            height={2000}
            alt="main"
          />
        </div>
      </div>
    </>
  );
}
