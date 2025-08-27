import Link from "next/link";
import Logo from "./navbar/Logo";

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Logo />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CollabNotes. All rights reserved.
          </span>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
