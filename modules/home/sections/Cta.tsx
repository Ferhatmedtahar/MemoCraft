import AuthForm from "@/components/common/navbar/AuthForm";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { Target } from "lucide-react";

async function Cta({ user }: { user: User | null }) {
  return (
    <section className="py-20 px-4 border-t-2 border-border">
      <div className="container mx-auto text-center max-w-4xl flex flex-col items-center gap-6">
        <div>
          <Target className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-4xl font-bold text-foreground ">
            Ready to transform your learning?
          </h3>
        </div>
        <p className="text-xl text-muted-foreground ">
          Join thousands of students and professionals who are already learning
          smarter with MemoCraft.
        </p>
        {user ? (
          <>
            <Button variant="secondary" size={"lg"}>
              Go to Dashboard
            </Button>
          </>
        ) : (
          <AuthForm />
        )}
      </div>
    </section>
  );
}

export default Cta;
