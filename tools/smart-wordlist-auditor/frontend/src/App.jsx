import React, { useState } from 'react';
import { Terminal, Shield, Zap, Download, Lock, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

function App() {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    birthdate: '',
    favorite_numbers: '',
    pet_name: '',
    email_username: '',
    common_words: ''
  });

  const [generatedWords, setGeneratedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auditPassword, setAuditPassword] = useState('');
  const [auditResult, setAuditResult] = useState(null);

  const handleInputChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const generateWordlist = async () => {
    setLoading(true);
    try {
      const payload = {
        ...userInfo,
        favorite_numbers: userInfo.favorite_numbers.split(',').map(n => n.trim()).filter(n => n),
        common_words: userInfo.common_words.split(',').map(w => w.trim()).filter(w => w)
      };
      const response = await axios.post(`${API_BASE}/generate`, payload);
      setGeneratedWords(response.data.wordlist);
    } catch (error) {
      console.error("Generation failed", error);
    }
    setLoading(false);
  };

  const runAudit = async () => {
    try {
      const response = await axios.post(`${API_BASE}/audit?password=${encodeURIComponent(auditPassword)}`);
      setAuditResult(response.data);
    } catch (error) {
      console.error("Audit failed", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold neon-text mb-2 flex items-center justify-center gap-4">
          <Shield size={48} /> SMART AUDITOR
        </h1>
        <p className="text-blue-400 tracking-widest uppercase text-sm">Educational Cybersecurity Tool</p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <section className="glass-card p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Terminal className="text-green-500" /> Target Profiler
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="first_name" placeholder="First Name" className="form-input" onChange={handleInputChange} />
              <input name="last_name" placeholder="Last Name" className="form-input" onChange={handleInputChange} />
            </div>
            <input name="nickname" placeholder="Nickname" className="form-input" onChange={handleInputChange} />
            <input name="birthdate" type="date" className="form-input" onChange={handleInputChange} />
            <input name="favorite_numbers" placeholder="Favorite Numbers (comma separated)" className="form-input" onChange={handleInputChange} />
            <input name="pet_name" placeholder="Pet Name" className="form-input" onChange={handleInputChange} />
            <input name="email_username" placeholder="Email Username" className="form-input" onChange={handleInputChange} />
            <textarea name="common_words" placeholder="Common words/hobbies (comma separated)" className="form-input h-24" onChange={handleInputChange}></textarea>
            
            <button 
              onClick={generateWordlist}
              disabled={loading}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Activity className="animate-spin" /> : <Zap />}
              GENERATE INTELLIGENT WORDLIST
            </button>
          </div>
        </section>

        {/* Results Section */}
        <section className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="text-blue-500" /> Output Stream
            </h2>
            <span className="bg-green-900 text-green-400 px-3 py-1 rounded text-xs font-mono">
              {generatedWords.length} PASSWORDS
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] border border-green-900 rounded bg-black/50 p-4 font-mono text-sm">
            {generatedWords.length > 0 ? (
              <ul className="space-y-1">
                {generatedWords.map((pw, i) => (
                  <li key={i} className="text-green-500/80 hover:text-green-400 flex items-center gap-2">
                    <ChevronRight size={14} /> {pw}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No data generated yet...</p>
            )}
          </div>
          
          <button className="btn-primary mt-6 flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
            <Download size={18} /> EXPORT WORDLIST (.TXT)
          </button>
        </section>

        {/* Auditor Section */}
        <section className="glass-card p-6 md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock className="text-purple-500" /> Strength Auditor
          </h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Enter password to audit..." 
              className="form-input font-mono text-xl"
              value={auditPassword}
              onChange={(e) => setAuditPassword(e.target.value)}
            />
            <button onClick={runAudit} className="btn-primary px-8">AUDIT</button>
          </div>

          {auditResult && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-blue-900 rounded bg-blue-900/10">
                <p className="text-blue-400 text-xs uppercase mb-1">Strength Score</p>
                <p className="text-3xl font-bold">{auditResult.score}/4</p>
                <div className="w-full bg-gray-800 h-2 mt-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${auditResult.score > 2 ? 'bg-green-500' : 'bg-red-500'}`} 
                    style={{width: `${(auditResult.score / 4) * 100}%`}}
                  ></div>
                </div>
              </div>
              <div className="p-4 border border-green-900 rounded bg-green-900/10">
                <p className="text-green-400 text-xs uppercase mb-1">Entropy</p>
                <p className="text-3xl font-bold">{auditResult.entropy} bits</p>
              </div>
              <div className="p-4 border border-purple-900 rounded bg-purple-900/10">
                <p className="text-purple-400 text-xs uppercase mb-1">Crack Time (Display)</p>
                <p className="text-xl font-bold">{auditResult.crack_times.online_no_throttling_10_per_second}</p>
              </div>
              
              {auditResult.warning && (
                <div className="md:col-span-3 p-4 border border-red-900 bg-red-900/10 rounded flex items-start gap-3">
                  <AlertTriangle className="text-red-500 shrink-0" />
                  <div>
                    <p className="text-red-400 font-bold">WARNING</p>
                    <p className="text-sm opacity-80">{auditResult.warning}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="mt-12 text-center text-xs text-gray-600 border-t border-gray-900 pt-8">
        <p className="text-red-900 uppercase tracking-tighter mb-2 font-bold">Legal Notice: Educational Tool Only</p>
        <p>This software is designed for cybersecurity students to understand password vulnerabilities. Unauthorized use is strictly prohibited. Use only in controlled lab environments with explicit permission.</p>
      </footer>
    </div>
  );
}

export default App;
