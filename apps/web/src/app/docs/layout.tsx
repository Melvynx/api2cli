import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { CopyMarkdownButton } from "@/components/copy-markdown-button";
import { getDocSections } from "./doc-manager";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = await getDocSections();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-1">
        <DocsSidebar sections={sections} />
        <main className="min-w-0 flex-1">
          <div className="relative">
            <div className="absolute top-4 right-8">
              <CopyMarkdownButton />
            </div>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
