import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        <Button variant="outline" asChild className="mb-8 w-fit">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-primary/10 p-4 border-2  w-fit mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated:{" "}
            <Badge variant="default">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Badge>
          </p>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8">
          <Card.Header>
            <Card.Title className="flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Privacy at a Glance
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <Card.Content className="text-center p-4">
                  <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <Card.Title className="text-sm">
                    Your data is encrypted
                  </Card.Title>
                  <Card.Description>End-to-end protection</Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content className="text-center p-4">
                  <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <Card.Title className="text-sm">
                    You control your data
                  </Card.Title>
                  <Card.Description>Delete anytime</Card.Description>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content className="text-center p-4">
                  <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <Card.Title className="text-sm">No data selling</Card.Title>
                  <Card.Description>
                    Never shared with third parties
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>
          </Card.Content>
        </Card>

        {/* Privacy Policy Content */}
        <div className="space-y-8">
          <Card>
            <Card.Header>
              <Card.Title>Information We Collect</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Information</h3>
                <p className="text-muted-foreground">
                  When you create an account with MemoCraft, we collect basic
                  information such as your email address, username, and
                  password. This information is necessary to provide you with
                  access to your account and to ensure the security of your
                  data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Content and Usage Data</h3>
                <p className="text-muted-foreground">
                  We collect and store the notes, documents, and other content
                  you create or upload to our platform. We also collect usage
                  information such as when you access the service, which
                  features you use, and how you interact with the platform to
                  improve our services.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Technical Information</h3>
                <p className="text-muted-foreground">
                  Like most online services, we automatically collect certain
                  technical information including your IP address, browser type,
                  device information, and operating system. This helps us
                  provide a better service and troubleshoot technical issues.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>How We Use Your Information</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Provision</h3>
                <p className="text-muted-foreground">
                  We use your information primarily to provide, maintain, and
                  improve MemoCraft. This includes storing your notes, enabling
                  collaboration features, and providing AI-powered assistance
                  for your learning needs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Communication</h3>
                <p className="text-muted-foreground">
                  We may use your contact information to send you important
                  updates about the service, security notifications, or
                  responses to your support requests. You can opt out of
                  non-essential communications at any time.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">AI Features</h3>
                <p className="text-muted-foreground">
                  When you use our AI tutoring features, your note content and
                  questions are processed to provide personalized responses.
                  This processing is done securely and your data is not used to
                  train external AI models.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Data Sharing and Disclosure</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">No Sale of Personal Data</h3>
                <p className="text-muted-foreground">
                  We do not sell, rent, or trade your personal information to
                  third parties. Your data belongs to you, and we respect that
                  ownership.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Service Providers</h3>
                <p className="text-muted-foreground">
                  We work with trusted service providers who help us operate
                  MemoCraft, such as cloud hosting providers and email services.
                  These providers have access only to the information necessary
                  to perform their services and are contractually bound to
                  protect your data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Legal Requirements</h3>
                <p className="text-muted-foreground">
                  We may disclose your information if required by law, such as
                  in response to a valid legal request from law enforcement or
                  to protect the rights, property, or safety of MemoCraft, our
                  users, or others.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Data Security</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your
                data, including encryption in transit and at rest, secure
                authentication systems, and regular security audits. While no
                system is 100% secure, we continuously work to improve our
                security practices.
              </p>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Your Rights and Choices</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Access and Control</h3>
                <p className="text-muted-foreground">
                  You have the right to access, update, or delete your personal
                  information at any time through your account settings. You can
                  also export your data or permanently delete your account if
                  you choose to stop using MemoCraft.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Data Portability</h3>
                <p className="text-muted-foreground">
                  You can export your notes and data in standard formats at any
                  time. We believe your data should never be locked into our
                  platform.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Contact Us</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this privacy policy or our data
                practices, please contact us at:
              </p>
              <div className="space-x-2">
                <Link
                  target="_blank"
                  href={"https://www.linkedin.com/in/ferhatmohamedtahar"}
                >
                  <Badge variant="outline">LinkedIn</Badge>
                </Link>
                <Link
                  target="_blank"
                  href={"https://github.com/Ferhatmedtahar/"}
                >
                  <Badge variant="outline">Github</Badge>
                </Link>

                <br />
              </div>
              <p className="text-muted-foreground mt-4">
                We&apos;re committed to addressing your privacy concerns and
                will respond to your inquiry within 30 days of receipt.
              </p>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
