import {
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Inter,
  Mulish,
  Noto_Sans_Mono,
} from "next/font/google";
import { cn } from "./utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontInstrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});
const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const fontMulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
});
const fontNotoSansMono = Noto_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-noto-mono",
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInstrument.variable,
  fontInter.variable,
  fontMulish.variable,
  fontNotoSansMono.variable
);
