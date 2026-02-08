"use client";

import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-950 dark:via-indigo-950/50 dark:to-slate-900">
      {/* Header with Dark Mode Toggle */}
      <header className="fixed right-8 top-8 z-50">
        <DarkModeToggle />
      </header>

      {/* Hero Section */}
      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-24">
        <div className="animate-fade-in text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-2 text-sm font-medium text-indigo-600 shadow-lg backdrop-blur-xl dark:bg-slate-800/80 dark:text-indigo-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </span>
            Phase II — Production Ready
          </div>

          {/* Title */}
          <h1 className="mb-6 text-7xl font-bold leading-tight tracking-tight">
            <span className="gradient-text">The Evolution</span>
            <br />
            <span className="text-slate-900 dark:text-slate-100">of Todo</span>
          </h1>

          {/* Subtitle */}
          <p className="mb-4 text-xl text-slate-600 dark:text-slate-400">
            Experience task management reimagined
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-500">
            A beautifully crafted, intelligent task management system with premium UI,
            advanced dark mode, and seamless multi-user experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth"
              className="btn-pill btn-ripple hover-glow group inline-flex min-h-[56px] items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 px-10 text-lg font-semibold text-white shadow-2xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50 active:scale-95"
            >
              <span>Get Started</span>
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <Link
              href="/dashboard"
              className="btn-pill group inline-flex min-h-[56px] items-center justify-center gap-3 border-2 border-slate-300 bg-white/80 px-10 text-lg font-semibold text-slate-700 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:bg-white active:scale-95 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800"
            >
              <span>View Dashboard</span>
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0  0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 w-full max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Powerful. Beautiful. Intuitive.
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Everything you need to stay organized and productive
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="glass-card hover-lift animate-slide-up group rounded-3xl p-8 stagger-1">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Lightning Fast
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Optimized performance with skeleton loaders, debounced search, and instant UI updates
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card hover-lift animate-slide-up group rounded-3xl p-8 stagger-2">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Secure & Private
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                JWT authentication with user isolation ensures your tasks are always private and secure
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card hover-lift animate-slide-up group rounded-3xl p-8 stagger-3">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
                Beautiful Dark Mode
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Sophisticated dark mode with smooth transitions and system preference detection
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 w-full max-w-4xl">
          <div className="glass-card animate-scale-in rounded-3xl p-12">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold gradient-text">99.9%</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold gradient-text">&lt;50ms</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Response Time</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold gradient-text">100%</div>
                <div className="text-sm font-medium text-slate-600 dark:text-slate-400">User Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
