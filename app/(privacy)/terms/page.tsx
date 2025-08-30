import { AlertTriangle, ArrowLeft, CheckCircle, FileText } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - MemoCraft",
  description:
    "Read our terms of service and understand your rights and responsibilities when using MemoCraft.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Key Points */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Key Points
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>You retain ownership of all your notes and content</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Use MemoCraft responsibly and legally</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>We provide the service "as is" with reasonable effort</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p>Either party can terminate these terms with notice</p>
            </div>
          </div>
        </div>

        {/* Terms Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using MemoCraft ("the Service"), you agree to be
            bound by these Terms of Service ("Terms"). If you do not agree to
            these Terms, please do not use the Service. These Terms apply to all
            users of the Service, including visitors, registered users, and
            paying customers.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            MemoCraft is a collaborative note-taking and learning platform that
            allows users to create, organize, share, and enhance their notes
            with AI-powered features. The Service includes web and mobile
            applications, collaboration tools, and artificial intelligence
            features designed to support learning and productivity.
          </p>

          <h2>3. User Accounts and Registration</h2>
          <h3>Account Creation</h3>
          <p>
            To access certain features of the Service, you must create an
            account. You agree to provide accurate, current, and complete
            information during registration and to update such information as
            necessary to maintain its accuracy.
          </p>

          <h3>Account Security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account.
          </p>

          <h3>Age Requirements</h3>
          <p>
            You must be at least 13 years old to use MemoCraft. If you are
            between 13 and 18 years old, you confirm that you have your parent
            or guardian's permission to use the Service.
          </p>

          <h2>4. User Content and Intellectual Property</h2>
          <h3>Your Content</h3>
          <p>
            You retain all rights to the content you create, upload, or share
            through MemoCraft ("User Content"). By using the Service, you grant
            us a limited, non-exclusive license to host, store, and display your
            User Content solely for the purpose of providing the Service to you.
          </p>

          <h3>Shared Content</h3>
          <p>
            When you share notes or collaborate with others, you grant those
            users permission to view and interact with the shared content
            according to the permissions you set. You are responsible for
            managing these permissions appropriately.
          </p>

          <h3>Our Intellectual Property</h3>
          <p>
            The MemoCraft platform, including its design, features, and
            underlying technology, is owned by us and protected by copyright,
            trademark, and other intellectual property laws. You may not copy,
            modify, or create derivative works of our platform.
          </p>

          <h2>5. Acceptable Use Policy</h2>
          <p>You agree not to use MemoCraft to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>
              Upload or share content that is illegal, harmful, threatening,
              abusive, or offensive
            </li>
            <li>
              Attempt to gain unauthorized access to our systems or other users'
              accounts
            </li>
            <li>Use the Service to send spam or unsolicited communications</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>
              Use automated tools to access the Service without permission
            </li>
          </ul>

          <h2>6. AI Features and Data Processing</h2>
          <h3>AI Tutoring</h3>
          <p>
            Our AI tutoring features process your notes and questions to provide
            educational assistance. This processing is done securely and your
            content is not used to train external AI models or shared with third
            parties.
          </p>

          <h3>Usage Limits</h3>
          <p>
            AI features are subject to daily usage limits to ensure fair access
            for all users and to manage our operational costs. Current limits
            are 30 AI requests per 24-hour period, which reset daily.
          </p>

          <h2>7. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Our collection, use, and protection
            of your personal information is governed by our Privacy Policy,
            which is incorporated into these Terms by reference. Please review
            our Privacy Policy to understand our data practices.
          </p>

          <h2>8. Service Availability and Modifications</h2>
          <h3>Service Availability</h3>
          <p>
            We strive to keep MemoCraft available 24/7, but we cannot guarantee
            uninterrupted access. The Service may be temporarily unavailable due
            to maintenance, updates, or circumstances beyond our control.
          </p>

          <h3>Service Modifications</h3>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect
            of the Service at any time. We will provide reasonable notice of
            significant changes that may affect your use of the Service.
          </p>

          <h2>9. Termination</h2>
          <h3>Termination by You</h3>
          <p>
            You may terminate your account at any time by using the account
            deletion feature in your settings. Upon termination, your access to
            the Service will cease, and your data will be deleted according to
            our data retention policies.
          </p>

          <h3>Termination by Us</h3>
          <p>
            We may suspend or terminate your account if you violate these Terms
            or if we believe your use of the Service poses a risk to other users
            or our systems. We will provide notice when reasonably possible.
          </p>

          <h2>10. Disclaimers and Limitation of Liability</h2>
          <h3>Service Disclaimer</h3>
          <p>
            The Service is provided "as is" and "as available" without
            warranties of any kind. While we strive to provide a reliable and
            useful service, we cannot guarantee that it will meet all your needs
            or be error-free.
          </p>

          <h3>AI Disclaimer</h3>
          <p>
            Our AI features are designed to assist with learning but should not
            be considered a substitute for professional education, tutoring, or
            academic advice. AI responses may contain errors and should be
            verified independently.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, MemoCraft shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising from your use of the Service.
          </p>

          <h2>11. Governing Law and Disputes</h2>
          <p>
            These Terms are governed by the laws of the United States. Any
            disputes arising from these Terms or your use of the Service will be
            resolved through binding arbitration, except for disputes that may
            be brought in small claims court.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time to reflect changes in
            our Service or legal requirements. We will notify you of material
            changes by posting the updated Terms on our website and updating the
            "Last updated" date. Your continued use of the Service after such
            changes constitutes acceptance of the new Terms.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at:
          </p>
          <ul>
            <li>Email: legal@MemoCraft.com</li>
            <li>Subject Line: Terms of Service Question</li>
          </ul>
          <p>We will respond to your inquiry within a reasonable time frame.</p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Important Notice
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                These terms of service are a legally binding contract between
                you and MemoCraft. By using our service, you acknowledge that
                you have read, understood, and agree to these terms. If you do
                not agree to these terms, please do not use our service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
