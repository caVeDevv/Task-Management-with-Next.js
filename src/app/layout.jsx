import "./globals.css";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../context/CrudContext";
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-bricolage",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Task-M",
  description: "Your All-in-One Task Management Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.className} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <DataProvider>{children}</DataProvider>
        </AuthProvider>
        <Toaster position="bottom-center" duration={1800} />
      </body>
    </html>
  );
}
