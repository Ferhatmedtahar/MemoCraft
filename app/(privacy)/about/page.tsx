import { ArrowLeft, BookOpen, Brain, Users, Zap } from "lucide-react";
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
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

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
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              MemoCraft was born from a simple belief: that learning is most
              powerful when it's collaborative, organized, and enhanced by
              intelligent tools. We've created a platform that transforms the
              way people take notes, study, and share knowledge.
            </p>
            <p className="text-lg leading-relaxed">
              Whether you're a student preparing for exams, a professional
              managing complex projects, or a researcher organizing vast amounts
              of information, MemoCraft provides the tools you need to capture,
              organize, and learn from your notes more effectively than ever
              before.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Powered Learning</h3>
                <p className="text-muted-foreground">
                  Our intelligent tutor helps you understand your notes better
                  with personalized explanations and answers to your questions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Seamless Collaboration</h3>
                <p className="text-muted-foreground">
                  Share notes, collaborate in real-time, and learn together with
                  classmates, colleagues, and study groups.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Smart Organization</h3>
                <p className="text-muted-foreground">
                  Automatically format your notes with markdown, organize them
                  intuitively, and find what you need when you need it.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Built for speed and efficiency, so you can focus on learning
                  rather than fighting with your tools.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              MemoCraft started as a solution to a common problem: traditional
              note-taking apps were either too simple or too complex, and none
              of them truly understood how people learn and collaborate in the
              modern world.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              We wanted to create something different—a platform that combines
              the simplicity of great design with the power of artificial
              intelligence and collaborative features. Our team believes that
              technology should enhance human learning, not replace it.
            </p>
            <p className="text-lg leading-relaxed">
              Today, MemoCraft serves thousands of users worldwide, helping them
              achieve their learning goals and collaborate more effectively than
              ever before.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-3">Privacy First</h3>
              <p className="text-muted-foreground">
                Your notes and data belong to you. We're committed to protecting
                your privacy and never selling your information.
              </p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-3">Accessibility</h3>
              <p className="text-muted-foreground">
                Learning should be accessible to everyone. We design our
                platform to be inclusive and usable by people of all abilities.
              </p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg">
              <h3 className="font-semibold mb-3">Continuous Innovation</h3>
              <p className="text-muted-foreground">
                We're constantly improving and adding new features based on user
                feedback and advances in technology.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions, feedback, or just want to say hello? We'd love to
            hear from you.
          </p>
          <div className="space-x-4">
            <Link
              href="mailto:hello@MemoCraft.com"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
// function page() {
//   return (
//     <div>
//       <div className="min-h-screen bg-background">
//         {/* Hero Section */}
//         <div className="min-h-screen w-full relative">
//           {/* Grid Background */}
//           <div
//             className="absolute inset-0 z-0 bg-primary/10"
//             style={{
//               backgroundImage: `
//       linear-gradient(
//   to right,
//   color-mix(in oklab, var(--color-primary) 35%,transparent) 1px,
//   transparent 1px
// ),p
// linear-gradient(
//   to bottom,
//   color-mix(in oklab, var(--color-primary) 35%, transparent) 1px,
//   transparent 1px
// )
// `,
//               backgroundSize: "40px 40px",
//             }}
//           />
//           {/* Your Content/Components */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default page;
