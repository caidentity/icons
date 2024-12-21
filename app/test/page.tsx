'use client';

import { useEffect, useState } from 'react';
import DebugPanel from '../components/DebugPanel';

interface IconMetadata {
  name: string
  category: string
  // add other properties as needed
}

export default function TestPage() {
  const [metadata, setMetadata] = useState<IconMetadata[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/icons-metadata.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
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
      <div className="mt-8">
        <DebugPanel />
      </div>
    </div>
  );
} 