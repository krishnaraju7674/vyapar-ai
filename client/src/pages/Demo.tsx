"use client";

import React from "react";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";

export default function DemoPage() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col justify-between p-4 md:p-8">
      {/* Chat Component */}
      <section className="flex justify-center items-start w-full flex-1 max-w-5xl mx-auto mt-4">
        <RuixenMoonChat onAnalyze={(idea) => alert(`Demo mode! Analysing idea: "${idea}"`)} />
      </section>

      {/* Footer */}
      <footer className="text-center text-neutral-500 py-4 mt-10 border-t border-neutral-800 text-sm">
        © {new Date().getFullYear()} Ruixen Demo Page
      </footer>
    </main>
  );
}
