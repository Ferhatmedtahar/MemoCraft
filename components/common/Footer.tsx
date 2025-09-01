import Link from "next/link";
import Logo from "./navbar/Logo";

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          {/* Logo */}
          <div className="order-1 md:order-1">
            <Logo />
          </div>

          {/* Navigation Links */}
          <div className="order-3 flex items-center space-x-4 text-sm text-muted-foreground md:order-2 md:space-x-6">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground  transition-colors"
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

          {/* Copyright */}
          <div className="order-2 md:order-3">
            <span className="text-sm text-muted-foreground text-center md:text-right">
              © {new Date().getFullYear()} MemoCraft. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
