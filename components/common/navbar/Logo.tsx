"use client";
import Image from "next/image";
import Link from "next/link";
function Logo() {
  return (
    <Link href="/" className=" ">
      <div className="flex items-center space-x-2">
        <Image
          src="/logo_3.png"
          alt="logo"
          width={32}
          height={32}
          className="border-2 border-primary  shadow-sm cursor-pointer hover:ring-primary/50 transition-all duration-200"
        />
        {/* <div className="w-8 h-8 bg-primary  flex items-center justify-center"> */}
        {/* <PencilLine className="w-5 h-5 text-white" /> */}
        {/* </div> */}
        <span className="text-xl font-bold sm:block hidden">MemoCraft</span>
      </div>
    </Link>
  );
}

export default Logo;
