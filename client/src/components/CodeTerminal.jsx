import React, { useState } from 'react';
import { Terminal, Check, Copy, Play, CheckCircle2, Cpu, Zap } from 'lucide-react';

export const CodeTerminal = () => {
  const [activeTab, setActiveTab] = useState('solution.cpp');
  const [isCopied, setIsCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionOutput, setExecutionOutput] = useState(null);

  const tabs = [
    { id: 'solution.cpp', label: 'solution.cpp', lang: 'C++20' },
    { id: 'judge_log', label: 'judge_eval.log', lang: 'Judge' },
    { id: 'club_init.sh', label: 'club_init.sh', lang: 'Bash' },
  ];

  const codeSnippets = {
    'solution.cpp': `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// CodeChef Campus Club - Algorithmic Optimization
void solve() {
    int n, k;
    if (!(cin >> n >> k)) return;
    vector<long long> scores(n);
    for (int i = 0; i < n; ++i) cin >> scores[i];
    
    sort(scores.rbegin(), scores.rend());
    long long max_skill_rating = 0;
    for (int i = 0; i < k; ++i) {
        max_skill_rating += scores[i];
    }
    cout << "Optimal Team Skill: " << max_skill_rating << "\\n";
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    solve();
    return 0;
}`,
    'judge_log': `[CodeChef-Judge-v4.2] Compiling solution.cpp with g++ -O3 ...
[CodeChef-Judge-v4.2] Compilation Successful. Binary size: 48KB.
Running against 25 Hidden Test Suites:
  Test #01: PASS [0.002s, 1.2MB]
  Test #02: PASS [0.005s, 1.4MB]
  Test #03: PASS [0.012s, 2.1MB]
  Test #04: PASS [0.021s, 3.8MB]
  Test #05: PASS [0.038s, 4.2MB]
=========================================
STATUS: ACCEPTED (AC) 
Execution Time: 0.038s | Peak Memory: 4.2MB
Score: 100/100 | Campus Leaderboard: Rank #1`,
    'club_init.sh': `#!/usr/bin/env bash
# Welcome to CodeChef Campus Club
echo "🚀 Bootstrapping Developer Society..."
curl -s https://api.codechefclub.edu/v1/init | bash

export CLUB_MOTTO="Code. Compete. Create."
export FOCUS_DOMAINS=("Algorithms" "WebDev" "Hackathons" "Systems")

echo "✔ Connecting with 500+ active campus peers..."
echo "✔ Unlocking weekly problem sets & mentor hours..."
echo " Ready! Next Contest: CodeSprint 2026."`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunJudge = () => {
    setIsRunning(true);
    setExecutionOutput('Submitting to CodeChef Campus Judge...');
    setTimeout(() => {
      setIsRunning(false);
      setExecutionOutput('Verdict: Accepted (AC) • Time: 0.04s • Memory: 3.8MB');
    }, 900);
  };

  return (
    <div className="w-full rounded-2xl bg-dark-card border border-dark-border/90 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Mac/Terminal Style Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-surface/90 border-b border-dark-border/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-crimson-500/80 hover:bg-crimson-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors" />
          <span className="ml-2 text-gray-400 text-[11px] font-sans font-medium flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-brand-400" />
            codechef-env ~/workspace
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-dark-bg/60 p-1 rounded-lg border border-dark-border/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Copy snippet"
            aria-label="Copy snippet"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="p-4 sm:p-5 overflow-x-auto bg-[#080A0F] max-h-80 sm:max-h-96">
        <pre className="text-gray-300 leading-relaxed">
          <code>
            {codeSnippets[activeTab].split('\n').map((line, index) => (
              <div key={index} className="table-row group">
                <span className="table-cell pr-4 text-right select-none text-gray-600 group-hover:text-gray-400">
                  {index + 1}
                </span>
                <span className="table-cell whitespace-pre font-mono text-gray-200">
                  {line.startsWith('//') || line.startsWith('# ') || line.startsWith('#!') ? (
                    <span className="text-gray-500 italic">{line}</span>
                  ) : line.includes('ACCEPTED') || line.includes('PASS') ? (
                    <span className="text-emerald-400 font-semibold">{line}</span>
                  ) : line.startsWith('[CodeChef') ? (
                    <span className="text-brand-400">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Terminal Live Runner Footer */}
      <div className="px-4 py-3 bg-dark-surface/90 border-t border-dark-border/80 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Fast I/O Enabled
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400 font-mono">GCC 13.2</span>
        </div>

        <div className="flex items-center gap-2">
          {executionOutput && (
            <span className="text-emerald-400 font-medium animate-in fade-in">
              {executionOutput}
            </span>
          )}
          <button
            onClick={handleRunJudge}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-300 font-semibold transition-all disabled:opacity-50 active:scale-95"
          >
            <Play className={`w-3 h-3 fill-brand-400 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Evaluating...' : 'Run Judge'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
