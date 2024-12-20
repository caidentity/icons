'use client';

import { useEffect, useState } from 'react';

export default function TestPage() {
  const [metadata, setMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/icons-metadata.json')
      .then(res => res.json())
      .then(data => setMetadata(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="p-4">
      <h1>Test Page</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {metadata && (
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      )}
    </div>
  );
} 