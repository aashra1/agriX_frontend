import "./globals.css";
import { Crimson_Pro } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-crimson-pro",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} font-crimsonpro`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
