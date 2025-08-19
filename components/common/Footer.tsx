import { FileText } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">CollabNotes</span>
          </div>
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CollabNotes. All rights reserved.
          </span>
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
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
            <Link href="#" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
