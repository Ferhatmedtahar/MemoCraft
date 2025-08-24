"use client";
import MarkdownRenderer from "@/components/common/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/modules/dashboard/notes/data/createNote";
import { formatToMarkdownWithAI } from "@/modules/dashboard/notes/data/FormatWithAI.action";
import { ArrowLeft, Eye, Loader2, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiFormatting, setAiFormatting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await createNote({ title, content });

      if (response.success) {
        router.push("/dashboard/notes");
      } else {
        const errorData = response?.error?.message || "failed to create note";
        throw new Error(errorData);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create post"
      );
      // toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAIFormat = async () => {
    if (!content.trim()) {
      // toast.error("Please add some content to format");
      return;
    }

    setAiFormatting(true);
    setError(null);

    try {
      const formattedContent = await formatToMarkdownWithAI(content);
      console.log("Formatted Content:", formattedContent);

      if (formattedContent && formattedContent.success) {
        setContent(formattedContent.formattedContent);
        // toast.success("Content formatted successfully!");
      } else {
        throw new Error("AI formatting failed");
      }
    } catch (error) {
      console.error("AI formatting failed:", error);
      setError(error instanceof Error ? error.message : "AI formatting failed");
      // toast.error("Failed to format content. Please try again.");
    } finally {
      setAiFormatting(false);
    }
  };

  // Prevent any interaction when loading or AI formatting
  const isProcessing = loading || aiFormatting;

  return (
    <div className="min-h-screen bg-background">
      {/* Loading overlay */}
      {/* {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg font-medium">
              {aiFormatting ? "Formatting with AI..." : "Creating post..."}
            </span>
          </div>
        </div>
      )} */}

      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="outline" asChild disabled={isProcessing}>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Create New Note</h1>
            <Button
              variant="outline"
              onClick={() => setPreview(!preview)}
              disabled={isProcessing}
            >
              <Eye className="h-4 w-4 mr-2" />
              {preview ? "Edit" : "Preview"}
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div
            className={`w-full grid grid-cols-1 ${
              preview ? "lg:grid-cols-2 gap-6" : ""
            }`}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Write Note</CardTitle>
                <Button
                  onClick={handleAIFormat}
                  disabled={isProcessing}
                  variant="outline"
                >
                  {aiFormatting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <StarIcon className="h-4 w-4 mr-2" />
                  )}
                  Format Markdown using AI
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter note title..."
                      required
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your note in markdown..."
                      rows={20}
                      required
                      className="min-h-80"
                      disabled={isProcessing}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create note"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {preview && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">
                      {title || "Post Title"}
                    </h2>
                    <MarkdownRenderer
                      content={content || "Your content will appear here..."}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
