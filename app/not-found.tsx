"use client";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFound() {
  return (
    <div className="flex flex-col  h-screen">
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <h2 className="text-4xl font-bold ">Page Not Found</h2>
        <Button variant="secondary">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default NotFound;
