import { ArrowLeft, Eye, Globe, Lock, Shield, UserCheck } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - MemoCraft",
  description:
    "Learn how MemoCraft protects your privacy and handles your data.",
};

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
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

        {/* Quick Summary */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Privacy at a Glance
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-background rounded-lg">
              <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium">Your data is encrypted</p>
              <p className="text-muted-foreground">End-to-end protection</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium">You control your data</p>
              <p className="text-muted-foreground">Delete anytime</p>
            </div>
            <div className="text-center p-4 bg-background rounded-lg">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium">No data selling</p>
              <p className="text-muted-foreground">
                Never shared with third parties
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Information We Collect</h2>
          <h3>Account Information</h3>
          <p>
            When you create an account with MemoCraft, we collect basic
            information such as your email address, username, and password. This
            information is necessary to provide you with access to your account
            and to ensure the security of your data.
          </p>

          <h3>Content and Usage Data</h3>
          <p>
            We collect and store the notes, documents, and other content you
            create or upload to our platform. We also collect usage information
            such as when you access the service, which features you use, and how
            you interact with the platform to improve our services.
          </p>

          <h3>Technical Information</h3>
          <p>
            Like most online services, we automatically collect certain
            technical information including your IP address, browser type,
            device information, and operating system. This helps us provide a
            better service and troubleshoot technical issues.
          </p>

          <h2>How We Use Your Information</h2>
          <h3>Service Provision</h3>
          <p>
            We use your information primarily to provide, maintain, and improve
            MemoCraft. This includes storing your notes, enabling collaboration
            features, and providing AI-powered assistance for your learning
            needs.
          </p>

          <h3>Communication</h3>
          <p>
            We may use your contact information to send you important updates
            about the service, security notifications, or responses to your
            support requests. You can opt out of non-essential communications at
            any time.
          </p>

          <h3>AI Features</h3>
          <p>
            When you use our AI tutoring features, your note content and
            questions are processed to provide personalized responses. This
            processing is done securely and your data is not used to train
            external AI models.
          </p>

          <h2>Data Sharing and Disclosure</h2>
          <h3>No Sale of Personal Data</h3>
          <p>
            We do not sell, rent, or trade your personal information to third
            parties. Your data belongs to you, and we respect that ownership.
          </p>

          <h3>Service Providers</h3>
          <p>
            We work with trusted service providers who help us operate
            MemoCraft, such as cloud hosting providers and email services. These
            providers have access only to the information necessary to perform
            their services and are contractually bound to protect your data.
          </p>

          <h3>Legal Requirements</h3>
          <p>
            We may disclose your information if required by law, such as in
            response to a valid legal request from law enforcement or to protect
            the rights, property, or safety of MemoCraft, our users, or others.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            data, including encryption in transit and at rest, secure
            authentication systems, and regular security audits. While no system
            is 100% secure, we continuously work to improve our security
            practices.
          </p>

          <h2>Your Rights and Choices</h2>
          <h3>Access and Control</h3>
          <p>
            You have the right to access, update, or delete your personal
            information at any time through your account settings. You can also
            export your data or permanently delete your account if you choose to
            stop using MemoCraft.
          </p>

          <h3>Data Portability</h3>
          <p>
            You can export your notes and data in standard formats at any time.
            We believe your data should never be locked into our platform.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            We use essential cookies to maintain your session and provide core
            functionality. We do not use tracking cookies for advertising
            purposes. You can control cookie settings in your browser, though
            disabling essential cookies may affect the functionality of the
            service.
          </p>

          <h2>International Users</h2>
          <p>
            MemoCraft is operated from the United States. If you're accessing
            our service from outside the US, please be aware that your
            information may be transferred to, stored, and processed in the
            United States where our servers are located.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            MemoCraft is not intended for children under 13 years of age. We do
            not knowingly collect personal information from children under 13.
            If we become aware that a child under 13 has provided us with
            personal information, we will take steps to delete such information.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time to reflect
            changes in our practices or legal requirements. We will notify you
            of any material changes by posting the updated policy on our website
            and updating the "Last updated" date above.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our data
            practices, please contact us at:
          </p>
          <ul>
            <li>Email: privacy@MemoCraft.com</li>
            <li>Subject Line: Privacy Policy Question</li>
          </ul>
          <p>
            We're committed to addressing your privacy concerns and will respond
            to your inquiry within 30 days of receipt.
          </p>
        </div>
      </div>
    </div>
  );
}
