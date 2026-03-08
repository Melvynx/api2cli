import { Navbar } from "@/components/navbar";
import { DocsSidebar } from "@/components/docs-sidebar";
import { CopyMarkdownButton } from "@/components/copy-markdown-button";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-1">
        <DocsSidebar />
        <main className="min-w-0 flex-1 px-8 py-12 lg:px-16">
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute top-0 right-0">
              <CopyMarkdownButton />
            </div>
            <article className="docs-content">{children}</article>
          </div>
        </main>
      </div>
    </div>
  );
}
