"use client";

import { useState } from "react";

interface NameResult {
  name: string;
  tagline: string;
  scores: {
    memorability: number;
    pronounceability: number;
    brandability: number;
  };
  overall: number;
}

const INDUSTRIES = [
  "Technology / Software",
  "E-commerce / Retail",
  "Health & Wellness",
  "Food & Beverage",
  "Finance / Fintech",
  "Education / EdTech",
  "Real Estate",
  "Fashion / Apparel",
  "Travel & Hospitality",
  "Creative / Design",
  "Marketing / Agency",
  "Other",
];

const STYLES = [
  { value: "creative", label: "Creative & Unique", emoji: "✨" },
  { value: "professional", label: "Professional & Trustworthy", emoji: "💼" },
  { value: "tech", label: "Modern & Tech", emoji: "⚡" },
  { value: "friendly", label: "Warm & Friendly", emoji: "😊" },
  { value: "minimal", label: "Short & Minimal", emoji: "⬜" },
];

function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="w-4 text-gray-600 font-medium">{value}</span>
    </div>
  );
}

export default function HomePage() {
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [style, setStyle] = useState("creative");
  const [results, setResults] = useState<NameResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please describe your business first.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, industry, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResults(data.names || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const checkDomain = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    window.open(`https://www.namecheap.com/domains/registration/results/?domain=${slug}.com`, "_blank");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-indigo-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">N</div>
          <span className="font-semibold text-gray-900">AI Business Name Generator</span>
          <span className="ml-auto text-xs text-gray-400 hidden sm:block">Powered by GPT-4o</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full mb-4">
            <span>🤖</span> AI-powered naming
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find the Perfect<br />
            <span className="text-indigo-600">Business Name</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Describe your business, choose a style, and get 15 unique name ideas with scores in seconds. Free, no signup required.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry (optional)</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naming Style</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-all ${
                      style === s.value
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe your business <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. An app that helps freelancers track their time and send invoices automatically..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" className="opacity-75" />
                </svg>
                Generating 15 name ideas...
              </span>
            ) : (
              "✨ Generate Business Names"
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-lg">
                {results.length} Name Ideas Generated
              </h2>
              {favorites.size > 0 && (
                <span className="text-sm text-indigo-600">{favorites.size} saved ❤️</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl border p-4 transition-all hover:shadow-md ${
                    favorites.has(r.name) ? "border-indigo-300 bg-indigo-50/30" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{r.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 italic">{r.tagline}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => toggleFavorite(r.name)}
                        className={`text-lg transition-transform hover:scale-125 ${
                          favorites.has(r.name) ? "text-red-500" : "text-gray-300"
                        }`}
                        title={favorites.has(r.name) ? "Remove from favorites" : "Save to favorites"}
                      >
                        ♥
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <ScoreBar value={r.scores.memorability} label="Memorability" />
                    <ScoreBar value={r.scores.pronounceability} label="Pronounce" />
                    <ScoreBar value={r.scores.brandability} label="Brandability" />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyName(r.name)}
                      className="flex-1 text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {copied === r.name ? "✅ Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => checkDomain(r.name)}
                      className="flex-1 text-xs py-1.5 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Check Domain
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ / SEO Content */}
        <section className="mt-20 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How does the AI business name generator work?",
                a: "Our AI analyzes your business description, industry, and desired style, then generates 15 unique, brandable names using advanced language models. Each name comes with a tagline and quality scores."
              },
              {
                q: "Are the generated business names trademarked?",
                a: "The generated names are suggestions only. We recommend checking trademark databases (USPTO, EUIPO) before registering a business name. The domain availability checker helps you find available .com domains."
              },
              {
                q: "How many names can I generate for free?",
                a: "You can generate business names for free without any account. Each generation produces 15 unique name ideas with full scoring and taglines."
              },
              {
                q: "Can I use these names for my real business?",
                a: "Yes! The names are completely free to use. Just make sure to verify trademark availability and register the business name/domain before launch."
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
        <p>© 2026 AI Business Name Generator · Free AI-Powered Naming Tool</p>
      </footer>
    </main>
  );
}
