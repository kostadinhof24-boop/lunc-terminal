"use client";

import Link from "next/link";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { useState } from "react";

export default function Navbar() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/wallet", label: "Wallet" },
    { href: "/dfc", label: "DFC Hub" },
    { href: "/validators", label: "Validators" },
    { href: "/governance", label: "Governance" },
    { href: "/news", label: "News" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Left side */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-white tracking-tight">
              LUNC TERMINAL
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Wallet / Right side */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300 font-mono hidden sm:block">
                  {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                </span>
                <button 
                  onClick={disconnect}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={connect}
                className="px-4 py-2 text-sm font-semibold text-black bg-[#F0B90B] hover:bg-yellow-400 rounded-lg transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}