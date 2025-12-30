
import React, { useState } from 'react';
import { analyzePost } from './services/geminiService';
import { AnalysisResult } from './types';
import MetricCard from './components/MetricCard';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please provide the post content for deep analysis.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzePost(content, url);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze post. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <header className="gradient-bg py-16 px-4 text-center text-white shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            LinkedIn <span className="text-blue-200">Post Analyzer</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto opacity-90">
            Paste your post details to uncover algorithmic bottlenecks and get a blueprint for your next viral success.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-10">
        {/* Input Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-slate-200">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Post Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/posts/..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-100 focus:border-[#0a66c2] outline-none transition-all text-slate-600"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Post Content (Required)</label>
                <textarea
                  placeholder="Paste the full text of your post here..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:ring-4 focus:ring-blue-100 focus:border-[#0a66c2] outline-none transition-all h-32 text-slate-600"
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-lg text-white bg-[#0a66c2] hover:bg-[#004182] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analyzing Post Performance...</span>
                </>
              ) : (
                <>
                  <span>Analyze Performance</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Reach Summary */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col justify-center">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Growth Score</span>
                <div className={`text-5xl font-black ${result.score > 70 ? 'text-green-600' : result.score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {result.score}<span className="text-xl text-slate-300">/100</span>
                </div>
              </div>
              <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white ${result.perceivedReach.status === 'High' ? 'bg-green-500' : result.perceivedReach.status === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                     Potential: {result.perceivedReach.status}
                   </div>
                   <h3 className="font-bold text-slate-800 uppercase tracking-tight text-sm">Impression Diagnostic</h3>
                 </div>
                 <p className="text-slate-600 leading-relaxed italic text-sm">
                   "{result.perceivedReach.explanation}"
                 </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard label="Hook Impact" score={result.metricBreakdown.hook} critique="Measures likelihood of 'See More' engagement." />
              <MetricCard label="Dwell Potential" score={result.metricBreakdown.value} critique="How well you retain attention throughout the text." />
              <MetricCard label="Formatting" score={result.metricBreakdown.formatting} critique="Algorithm preference for spacing and readability." />
            </div>

            {/* Detailed Analysis */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-[#002244] text-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold flex items-center text-blue-300 mb-6">
                  <span className="mr-3 text-2xl">⚡</span> Algorithmic Breakdown
                </h3>
                <ul className="space-y-4 mb-8">
                  {result.algorithmicAnalysis.throttlingFactors.map((factor, i) => (
                    <li key={i} className="flex items-start text-sm">
                      <span className="text-blue-400 mr-3">→</span>
                      <span className="text-slate-300 leading-tight">{factor}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-white/10">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center md:text-left">Retention Strategy</h4>
                   <p className="text-slate-400 italic text-sm leading-relaxed text-center md:text-left">"{result.algorithmicAnalysis.dwellTimeCritique}"</p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl h-full flex flex-col justify-center">
                    <h3 className="font-bold text-blue-800 mb-6 text-lg flex items-center">
                      <span className="mr-2 text-2xl">🚀</span> Engagement Blueprint
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Growth Tactics</span>
                            <p className="text-sm text-blue-900 leading-relaxed mt-2 font-medium">{result.engagementStrategy.toGetMoreComments}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200/50">
                            <div>
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Likes Strategy</span>
                                <p className="text-xs text-blue-800 leading-tight">{result.engagementStrategy.toGetMoreLikes}</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Reaction Strategy</span>
                                <p className="text-xs text-blue-800 leading-tight">{result.engagementStrategy.toGetMoreReactions}</p>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Next Step Blueprint */}
            <div className="bg-gradient-to-r from-[#0a66c2] to-[#004182] p-10 rounded-3xl shadow-2xl text-white">
                <div className="max-w-3xl">
                    <span className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-4 block">Recommended Next Post</span>
                    <h2 className="text-3xl font-black mb-4 leading-tight">{result.nextPostBlueprint.recommendedTopic}</h2>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                            <span className="text-[10px] text-blue-200 block uppercase font-bold tracking-tighter">Suggest Format</span>
                            <span className="font-bold text-sm">{result.nextPostBlueprint.suggestedFormat}</span>
                        </div>
                    </div>
                    <p className="text-blue-100 leading-relaxed italic border-l-4 border-blue-400 pl-6 py-2">
                        "{result.nextPostBlueprint.whyThisTopic}"
                    </p>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
