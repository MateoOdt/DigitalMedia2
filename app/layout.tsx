"use client"
import React from "react";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import AsideBar from "../components/AsideBar";
import { IoSettings, IoWallet } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  const currentPath = usePathname();

  const menu = [
    {
      name: "Wallet",
      index: 1,
      icon: <IoWallet />,
      link: "/",
    },
    {
      name: "Settings",
      index: 2,
      icon: <IoSettings />,
      link: "/test",
    },
  ];

  return (
    <html lang="en">
      <Head>
        <title>Crypto wallet</title>
        <meta name="description" content="A simple crypto wallet app" />
      </Head>
      <body className={`flex h-full overflow-hidden bg-primary-100 ${inter.className}`}>
        <AsideBar currentPath={currentPath} menu={menu} />
        <main className="flex flex-col w-11/12 rounded-3xl bg-primary-300 my-2 h-[98vh]">
          {/* Use max-h-screen and overflow-y-auto to limit height and enable scrolling */}
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
