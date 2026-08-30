import localFont from "next/font/local";
import { Lobster, Plaster } from "next/font/google";

export const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

export const lobster = Lobster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lobster",
  display: "swap",
});

export const plaster = Plaster({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-plaster",
  display: "swap",
});
