import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Brain, PaintBucket, Zap } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About - MemoCraft",
  description:
    "Learn more about MemoCraft and our mission to revolutionize collaborative note-taking and learning.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Back to Home */}
        <Button variant="outline" asChild className="w-fit mb-8">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            About MemoCraft
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering students and professionals to learn, collaborate, and
            succeed through intelligent note-taking.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-16">
          <Card.Header>
            <Card.Title className="text-2xl">Our Mission</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              MemoCraft was born from a simple belief: that learning is most
              powerful when it&apos;s collaborative, organized, and enhanced by
              intelligent tools. We&apos;ve created a platform that transforms
              the way people take notes, study, and share knowledge.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Whether you&apos;re a student preparing for exams, a professional
              managing complex projects, or a researcher organizing vast amounts
              of information, MemoCraft provides the tools you need to capture,
              organize, and learn from your notes more effectively than ever
              before.
            </p>
          </Card.Content>
        </Card>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <Card.Content className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 ">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Card.Title className="mb-2">
                      AI-Powered Learning
                    </Card.Title>
                    <Card.Description>
                      Our intelligent tutor helps you understand your notes
                      better with personalized explanations and answers to your
                      questions.
                    </Card.Description>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 ">
                    <PaintBucket className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Card.Title className="mb-2">Great Workspace</Card.Title>
                    <Card.Description>
                      Themes & Personalization Customize your workspace with
                      beautiful themes and personalization options.
                    </Card.Description>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 ">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Card.Title className="mb-2">Smart Organization</Card.Title>
                    <Card.Description>
                      Automatically format your notes with markdown, organize
                      them intuitively, and find what you need when you need it.
                    </Card.Description>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 ">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Card.Title className="mb-2">Lightning Fast</Card.Title>
                    <Card.Description>
                      Built for speed and efficiency, so you can focus on
                      learning rather than fighting with your tools.
                    </Card.Description>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Story Section */}
        <Card className="mb-16">
          <Card.Header>
            <Card.Title className="text-2xl">Our Story</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <p className="text-lg leading-relaxed text-muted-foreground">
              MemoCraft started as a solution to a common problem: traditional
              note-taking apps were either too simple or too complex, and none
              of them truly understood how people learn and collaborate in the
              modern world.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We wanted to create something different—a platform that combines
              the simplicity of great design with the power of artificial
              intelligence and collaborative features. Our team believes that
              technology should enhance human learning, not replace it.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Today, MemoCraft serves thousands of users worldwide, helping them
              achieve their learning goals and collaborate more effectively than
              ever before.
            </p>
          </Card.Content>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <Card.Content className="text-center p-6">
                <Card.Title className="mb-3">Privacy First</Card.Title>
                <Card.Description>
                  Your notes and data belong to you. We&apos;re committed to
                  protecting your privacy and never selling your information.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="text-center p-6">
                <Card.Title className="mb-3">Accessibility</Card.Title>
                <Card.Description>
                  Learning should be accessible to everyone. We design our
                  platform to be inclusive and usable by people of all
                  abilities.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content className="text-center p-6">
                <Card.Title className="mb-3">Continuous Innovation</Card.Title>
                <Card.Description>
                  We&apos;re constantly improving and adding new features based
                  on user feedback and advances in technology.
                </Card.Description>
              </Card.Content>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="w-full">
          <Card.Header>
            <Card.Title>Contact Us</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-muted-foreground mb-4">
              If you have any questions or feedback, please don&apos;t hesitate
              to contact us.
            </p>
            <div className="space-x-2">
              <Link
                target="_blank"
                href={"https://www.linkedin.com/in/ferhatmohamedtahar"}
              >
                <Badge variant="outline">LinkedIn</Badge>
              </Link>
              <Link target="_blank" href={"https://github.com/Ferhatmedtahar/"}>
                <Badge variant="outline">Github</Badge>
              </Link>

              <br />
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
