"use client"

import { useApp } from "@/app/lib/hooks/useApp"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface User {
  name: string;
  id: string;
  email: string;
  phoneNumber?: string;
  location: UserLocation;
  ip?: string;
  useName: string;
  token?: string;
}

export interface UserLocation {
  district: string;
  area: string;
}

export const Navigation = () => {
  const { user,api } = useApp();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToLogin =async () => {
    await api.user.logout();
    router.push("/login");
  };

  const goToRegister = () => {
    router.push("/signup");
  };

  const handleLogout = () => {
    router.push("/");
  };

  const navItems = [
    { name: "Map", href: "/" },
    { name: "Projects", href: "/projects" },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-base font-medium">
            KUNIMO
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-xs font-medium">
                    {getInitials(user.name || user.useName)}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel className="text-xs font-normal">
                    <div className="flex flex-col">
                      <p className="font-medium text-sm">{user.name || user.useName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={handleLogout} className="text-sm text-gray-500">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={goToLogin} size="sm" className="h-7 text-xs">
                  Log in
                </Button>
                <Button onClick={goToRegister} size="sm" className="h-7 text-xs bg-gray-900 hover:bg-gray-800">
                  Sign up
                </Button>
              </div>
            )}

            <button
              className="md:hidden p-1 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 py-1.5"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};