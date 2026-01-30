"use client";

import React, { useMemo, useState } from "react";
import data from "../../data/database.json";

type ExampleUrl = string;

type Subtype = {
  type: string;
  examples: ExampleUrl[];
};

type Topic = {
  type: string;
  subtypes: Subtype[];
};

// database.json is an object with numeric-string keys mapping to Topic
type Database = Record<string, Topic>;

const topicsData: Database = data as any;

export default function TopicsPage() {
  // Prepare a stable, sorted array of topics
  const topics = useMemo(() => {
    return Object.entries(topicsData)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, value]) => value);
  }, []);

  // Expanded state for top-level topics and subtypes
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [expandedSubtypes, setExpandedSubtypes] = useState<Record<string, boolean>>({});

  const toggleTopic = (idx: number) =>
    setExpandedTopics((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const toggleSubtype = (topicIdx: number, subtypeIdx: number) => {
    const key = `${topicIdx}-${subtypeIdx}`;
    setExpandedSubtypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 dark:bg-black">
      <main className="w-full max-w-4xl rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 p-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Topics</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Expand a type to see its subtypes. Expand a subtype to see example links.
          </p>
        </header>
        {/* Scrollable content box */}
        <section className="max-h-[75vh] overflow-y-auto p-5">
          <ul className="space-y-3">
            {topics.map((topic, tIdx) => {
              const isOpen = !!expandedTopics[tIdx];
              return (
                <li key={tIdx} className="rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleTopic(tIdx)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:hover:bg-zinc-800/60"
                  >
                    <span className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                      {topic.type}
                    </span>
                    <span
                      className={`select-none text-zinc-500 transition-transform dark:text-zinc-400 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                      aria-hidden
                    >
                      ▶
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
                      {topic.subtypes.length === 0 ? (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">No subtypes</p>
                      ) : (
                        <ul className="space-y-2">
                          {topic.subtypes.map((sub, sIdx) => {
                            const key = `${tIdx}-${sIdx}`;
                            const subOpen = !!expandedSubtypes[key];
                            return (
                              <li key={key} className="rounded-md">
                                <button
                                  type="button"
                                  aria-expanded={subOpen}
                                  onClick={() => toggleSubtype(tIdx, sIdx)}
                                  className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:hover:bg-zinc-800/60"
                                >
                                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {sub.type}
                                  </span>
                                  <span
                                    className={`select-none text-xs text-zinc-500 transition-transform dark:text-zinc-400 ${
                                      subOpen ? "rotate-90" : ""
                                    }`}
                                    aria-hidden
                                  >
                                    ▶
                                  </span>
                                </button>
                                {subOpen && (
                                  <div className="px-3 pb-2">
                                    {sub.examples && sub.examples.length > 0 ? (
                                      <ul className="list-inside list-disc space-y-1">
                                        {sub.examples.map((url, i) => (
                                          <li key={i} className="truncate text-sm">
                                            <a
                                              href={url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:underline dark:text-blue-400"
                                            >
                                              {url}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-zinc-600 dark:text-zinc-400">No examples</p>
                                    )}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
