"use client";
import { Button } from "@/components/ui/button";
import { signinWithGoogle } from "@/utils/actions";

const AuthForm = () => {
  return (
    <form className="flex flex-col gap-2">
      <Button formAction={signinWithGoogle}>Sign in with Google</Button>
    </form>
  );
};

export default AuthForm;
