"use client";
import { Button } from "@/components/ui/button";
import { signinWithGoogle } from "@/utils/actions";

const AuthForm = () => {
  return (
    <form className="flex flex-col gap-2">
      <Button
        className="hover:bg-yellow-600 hover:cursor-pointer"
        formAction={signinWithGoogle}
      >
        Sign in with Google
      </Button>
    </form>
  );
};

export default AuthForm;
