import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        <Button variant="outline" asChild className="w-fit">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-primary/10 p-4 border-2 w-fit mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Terms of Service
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

        {/* Key Points */}
        <Card className="mb-8">
          <Card.Header>
            <Card.Title className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Key Points
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  You retain ownership of all your notes and content
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">Use MemoCraft responsibly and legally</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  We provide the service &quot;as is&quot; with reasonable
                  effort
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">
                  Either party can terminate these terms with notice
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card>
            <Card.Header>
              <Card.Title>1. Acceptance of Terms</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-muted-foreground">
                By accessing or using MemoCraft (&quot;the Service&quot;), you
                agree to be bound by these Terms of Service (&quot;Terms&quot;).
                If you do not agree to these Terms, please do not use the
                Service. These Terms apply to all users of the Service,
                including visitors, registered users, and paying customers.
              </p>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>2. Description of Service</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-muted-foreground">
                MemoCraft is a collaborative note-taking and learning platform
                that allows users to create, organize, share, and enhance their
                notes with AI-powered features. The Service includes web and
                mobile applications, collaboration tools, and artificial
                intelligence features designed to support learning and
                productivity.
              </p>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>3. User Accounts and Registration</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Creation</h3>
                <p className="text-muted-foreground">
                  To access certain features of the Service, you must create an
                  account. You agree to provide accurate, current, and complete
                  information during registration and to update such information
                  as necessary to maintain its accuracy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Account Security</h3>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of
                  your account credentials and for all activities that occur
                  under your account. You agree to notify us immediately of any
                  unauthorized use of your account.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Age Requirements</h3>
                <p className="text-muted-foreground">
                  You must be at least 13 years old to use MemoCraft. If you are
                  between 13 and 18 years old, you confirm that you have your
                  parent or guardian&apos;s permission to use the Service.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>4. User Content and Intellectual Property</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Your Content</h3>
                <p className="text-muted-foreground">
                  You retain all rights to the content you create, upload, or
                  share through MemoCraft (&quot;User Content&quot;). By using
                  the Service, you grant us a limited, non-exclusive license to
                  host, store, and display your User Content solely for the
                  purpose of providing the Service to you.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Shared Content</h3>
                <p className="text-muted-foreground">
                  When you share notes or collaborate with others, you grant
                  those users permission to view and interact with the shared
                  content according to the permissions you set. You are
                  responsible for managing these permissions appropriately.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Our Intellectual Property
                </h3>
                <p className="text-muted-foreground">
                  The MemoCraft platform, including its design, features, and
                  underlying technology, is owned by us and protected by
                  copyright, trademark, and other intellectual property laws.
                  You may not copy, modify, or create derivative works of our
                  platform.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card className="w-full">
            <Card.Header>
              <Card.Title>5. Acceptable Use Policy</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-muted-foreground mb-4">
                You agree not to use MemoCraft to:
              </p>
              <div className="flex flex-col">
                <Badge variant="outline" className="mr-2 mb-2">
                  Violate any applicable laws or regulations
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Infringe on the intellectual property rights of others
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Upload or share content that is illegal, harmful, threatening,
                  abusive, or offensive
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Attempt to gain unauthorized access to our systems or other
                  users&apos; accounts
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Use the Service to send spam or unsolicited communications
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Interfere with or disrupt the Service or servers
                </Badge>
                <Badge variant="outline" className="mr-2 mb-2">
                  Use automated tools to access the Service without permission
                </Badge>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>6. AI Features and Data Processing</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">AI Tutoring</h3>
                <p className="text-muted-foreground">
                  Our AI tutoring features process your notes and questions to
                  provide educational assistance. This processing is done
                  securely and your content is not used to train external AI
                  models or shared with third parties.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Usage Limits</h3>
                <p className="text-muted-foreground">
                  AI features are subject to daily usage limits to ensure fair
                  access for all users and to manage our operational costs.
                  Current limits are 30 AI requests per 24-hour period, which
                  reset daily.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>
                10. Disclaimers and Limitation of Liability
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Disclaimer</h3>
                <p className="text-muted-foreground">
                  The Service is provided &quot;as is&quot; and &quot;as
                  available&quot; without warranties of any kind. While we
                  strive to provide a reliable and useful service, we cannot
                  guarantee that it will meet all your needs or be error-free.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">AI Disclaimer</h3>
                <p className="text-muted-foreground">
                  Our AI features are designed to assist with learning but
                  should not be considered a substitute for professional
                  education, tutoring, or academic advice. AI responses may
                  contain errors and should be verified independently.
                </p>
              </div>
            </Card.Content>
          </Card>

          <Card className="w-full">
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
            </Card.Content>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="mt-8 border-yellow-200 bg-yellow-50/50">
          <Card.Header>
            <Card.Title className="flex items-center text-yellow-800">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Important Notice
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-yellow-700">
              These terms of service are a legally binding contract between you
              and MemoCraft. By using our service, you acknowledge that you have
              read, understood, and agree to these terms. If you do not agree to
              these terms, please do not use our service.
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
