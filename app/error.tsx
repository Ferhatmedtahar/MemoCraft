"use client";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex flex-col  h-screen">
      <div className="h-full flex items-center justify-center flex-col gap-2">
        <h2 className="text-4xl font-bold ">Something went wrong!</h2>
        <Button variant="secondary" onClick={() => reset()}>
          Try Again
        </Button>
      </div>
      <Footer />
    </div>
  );
}

export default ErrorPage;
