export default function PressReleasePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link href="/press" className="text-orange-600 hover:text-orange-700 mb-8 inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Press
      </Link>
      
      <h1 className="text-4xl font-bold text-navy-900 mb-8">
        Press Release Title
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p>Full press release content here...</p>
      </div>
    </div>
  );
}