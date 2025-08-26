"use client";
import { MapPin } from "lucide-react";
import Link from "next/link";
function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <MapPin className="w-5 h-5 text-white" />
      </div>
      <Link href="/" className="text-xl font-bold ">
        CollabNotes
      </Link>
    </div>
  );
}

export default Logo;
