"use client";
import { PencilLine } from "lucide-react";
import Link from "next/link";
function Logo() {
  return (
    <Link href="/" className=" ">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-primary  flex items-center justify-center">
          <PencilLine className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold sm:block hidden">CollabNotes</span>
      </div>
    </Link>
  );
}

export default Logo;
