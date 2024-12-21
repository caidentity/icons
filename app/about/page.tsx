export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Icon Library</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Icon Library is a modern, searchable collection of SVG icons designed for developers and designers.
          Our library provides a simple and intuitive way to browse, search, and download icons for your projects.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Search icons by name and category</li>
          <li>Filter by tags</li>
          <li>Multiple size variants (16px and 24px)</li>
          <li>One-click downloads</li>
          <li>Copy icon names to clipboard</li>
          <li>Preview with metadata</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Usage</h2>
        <p className="mb-4">
          Browse our collection of icons using the search and filter tools. 
          Click on any icon to view its details, download the SVG file, or copy its name.
          All icons are available in both 16px and 24px sizes.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contributing</h2>
        <p>
          We welcome contributions! If you&apos;d like to add new icons or improve the platform,
          please visit our GitHub repository.
        </p>
      </div>
    </div>
  );
} 