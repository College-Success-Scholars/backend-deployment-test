import { Instrument_Serif } from "next/font/google";

const loginSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-login-serif",
});

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={loginSerif.variable}>{children}</div>;
}
