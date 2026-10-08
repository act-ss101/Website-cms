/**
 * Test Runner UI — Displays integration test results in the browser
 */
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Play, RotateCcw } from 'lucide-react';
import { runAllTests, TestResult } from '../tests/integrationTests';

export function TestRunner() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const runTests = async () => {
    setRunning(true);
    setCompleted(false);
    setResults([]);
    const res = await runAllTests();
    setResults(res);
    setRunning(false);
    setCompleted(true);
  };

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Integration Tests</h1>
            <p className="text-gray-500 text-sm">Full-stack system verification</p>
          </div>
          <button onClick={runTests} disabled={running} className="px-4 py-2 bg-forest text-cream rounded-lg font-medium flex items-center gap-2 hover:bg-forest-light disabled:opacity-50">
            {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            {running ? 'Running...' : 'Run Tests'}
          </button>
        </div>

        {completed && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-charcoal">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-100 text-center">
              <div className="text-2xl font-bold text-green-600">{passed}</div>
              <div className="text-xs text-green-600">Passed</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-100 text-center">
              <div className="text-2xl font-bold text-red-600">{failed}</div>
              <div className="text-xs text-red-600">Failed</div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 ${r.passed ? '' : 'bg-red-50/50'}`}>
                <div className="flex items-center gap-3">
                  {r.passed ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span className="text-sm text-charcoal">{r.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{r.duration.toFixed(1)}ms</span>
                  {!r.passed && r.error && (
                    <span className="text-xs text-red-500 max-w-[200px] truncate" title={r.error}>{r.error}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!completed && !running && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto bg-forest/10 rounded-full flex items-center justify-center mb-4">
              <Play size={24} className="text-forest" />
            </div>
            <p className="text-gray-500">Click "Run Tests" to verify all systems</p>
            <p className="text-gray-400 text-sm mt-2">Tests: Database, Auth, RBAC, CMS, Booking, i18n, Validation, Audit, Media</p>
          </div>
        )}

        {completed && (
          <div className="mt-6 p-4 bg-cream rounded-xl">
            <h3 className="font-semibold text-forest text-sm mb-2">System Status Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${failed === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-charcoal">Database (IndexedDB)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${failed === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-charcoal">Authentication & RBAC</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${failed === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-charcoal">CMS (CRUD + Versioning)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${failed === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-charcoal">Booking & Waitlist</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${failed === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-charcoal">i18n (TH/EN/JA)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${failed === 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-charcoal">Validation & Audit</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
