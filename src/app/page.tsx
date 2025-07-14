'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Languages } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [urduSummary, setUrduSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarise = async () => {
    setLoading(true);
    setSummary('');
    setUrduSummary('');
    try {
      const res = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setSummary(data.summary);
      setUrduSummary(data.urdu);
    } catch (err) {
      alert('Something went wrong! Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-4">📰 Blog Summariser</h1>
      <p className="text-lg text-muted-foreground text-center mb-8 max-w-xl">
        Enter a blog URL to fetch and generate a smart English summary and its Urdu translation.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl items-center">
        <Input
          placeholder="Enter blog URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSummarise} disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" /> Summarising...
            </>
          ) : (
            'Summarise'
          )}
        </Button>
      </div>

      <div className="mt-10 w-full max-w-3xl space-y-10">
        {summary && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">English Summary</h2>
            </div>
            <p className="leading-relaxed text-gray-700">{summary}</p>
          </div>
        )}

        {urduSummary && (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-right">
            <div className="flex items-center gap-2 mb-3 justify-end">
              <Languages className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Urdu Translation</h2>
            </div>
            <p className="leading-relaxed font-noto text-gray-800">{urduSummary}</p>
          </div>
        )}
      </div>
    </main>
  );
}
