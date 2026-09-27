import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Edit3,
  Clock,
  Mic,
  MicOff,
  AlertCircle,
  HelpCircle,
  Building2,
  Shield,
  Layers,
  Check,
  Send,
  RefreshCw,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';
import { useCareConnect } from '../context/CareConnectContext';
import { ExtractedRequirement, CategoryType, BeneficiaryType, PriorityType, SupportType } from '../types';
import { SAMPLE_AI_PROMPTS } from '../data/mockData';
import { parseNeedsLocally } from '../utils/smartLocalParser';

interface AINeedAssistantPageProps {
  onNeedsPublished: () => void;
}

export const AINeedAssistantPage: React.FC<AINeedAssistantPageProps> = ({
  onNeedsPublished,
}) => {
  const { careHomes, selectedHomeId, setSelectedHomeId, publishExtractedNeeds, customApiKey } =
    useCareConnect();

  const [promptInput, setPromptInput] = useState(
    'We need 15 blankets, 2 wheelchairs, a doctor for our elderly residents and someone to teach English to the children.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [extractedItems, setExtractedItems] = useState<ExtractedRequirement[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [engineSource, setEngineSource] = useState<string>('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<{ index: number; data: ExtractedRequirement } | null>(
    null
  );
  const [publishedCount, setPublishedCount] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const basePromptRef = useRef<string>('');

  // Clean up microphone on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Real Speech-to-Text Voice Dictation using browser Web Speech API
  const handleToggleVoice = () => {
    setSpeechError(null);

    // Stop recording if currently active
    if (isVoiceRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping recognition', e);
        }
      }
      setIsVoiceRecording(false);
      setVoiceStatus('');
      return;
    }

    // Check browser compatibility
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type your message directly.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      // Save existing text as base prefix
      basePromptRef.current = promptInput.trim();

      recognition.onstart = () => {
        setIsVoiceRecording(true);
        setVoiceStatus('Listening... Speak now into your microphone.');
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscripts = '';
        let interimTranscripts = '';

        for (let i = 0; i < event.results.length; ++i) {
          const chunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscripts += chunk + ' ';
          } else {
            interimTranscripts += chunk;
          }
        }

        const spokenContent = (finalTranscripts + interimTranscripts).trim();
        if (spokenContent) {
          if (basePromptRef.current) {
            setPromptInput(`${basePromptRef.current} ${spokenContent}`);
          } else {
            setPromptInput(spokenContent);
          }
          setVoiceStatus(`Transcribing: "${spokenContent.slice(-40)}"`);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError(
            'Microphone access denied. Please click the camera/microphone icon in your browser address bar to allow permissions.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceStatus('No speech detected. Listening...');
          return;
        } else {
          setSpeechError(`Microphone issue: ${event.error}.`);
        }
        setIsVoiceRecording(false);
      };

      recognition.onend = () => {
        setIsVoiceRecording(false);
        setVoiceStatus('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Could not access microphone. Please check your browser audio permissions.');
      setIsVoiceRecording(false);
      setVoiceStatus('');
    }
  };

  const handleOrganizeWithAI = async () => {
    if (!promptInput.trim()) return;

    setIsProcessing(true);
    setPublishedCount(null);
    setExtractedItems([]);
    setAiSummary('');

    // Step animation for Hours-to-Seconds Test visualization
    setProcessingStep('1. Analyzing unstructured natural language syntax...');
    await new Promise(r => setTimeout(r, 450));
    setProcessingStep('2. Extracting distinct requirement clauses...');
    await new Promise(r => setTimeout(r, 400));
    setProcessingStep('3. Categorizing beneficiaries, quantities & priorities...');

    try {
      // Call server-side Gemini route with optional user custom key
      const response = await fetch('/api/parse-needs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-gemini-key': customApiKey } : {}),
        },
        body: JSON.stringify({ prompt: promptInput.trim() }),
      });

      const json = await response.json();

      if (response.ok && json.success && json.data?.extractedRequirements?.length > 0) {
        setExtractedItems(
          json.data.extractedRequirements.map((item: any, idx: number) => ({
            ...item,
            id: `req-${Date.now()}-${idx}`,
            approved: true,
          }))
        );
        setAiSummary(json.data.summary || 'Requirements organized successfully.');
        setEngineSource(customApiKey ? 'Gemini 3.8 Flash (Custom Key)' : 'Gemini 3.8 Flash');
      } else {
        // Fallback to our high-accuracy local parser
        const localResult = parseNeedsLocally(promptInput.trim());
        setExtractedItems(localResult.extractedRequirements);
        setAiSummary(localResult.summary);
        setEngineSource('Smart Local Parser Engine (Zero Latency)');
      }
    } catch (err) {
      console.warn('Backend call failed, using smart local parser fallback', err);
      const localResult = parseNeedsLocally(promptInput.trim());
      setExtractedItems(localResult.extractedRequirements);
      setAiSummary(localResult.summary);
      setEngineSource('Smart Local Parser Engine (Zero Latency)');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleRemoveItem = (index: number) => {
    setExtractedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleApproval = (index: number) => {
    setExtractedItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, approved: !item.approved } : item))
    );
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setExtractedItems(prev =>
      prev.map((item, i) => (i === editingItem.index ? editingItem.data : item))
    );
    setEditingItem(null);
  };

  const handlePublishAllApproved = () => {
    const approved = extractedItems.filter(item => item.approved !== false);
    if (approved.length === 0) return;

    const count = publishExtractedNeeds(approved, selectedHomeId);
    setPublishedCount(count);
  };

  const activeHome = careHomes.find(h => h.id === selectedHomeId) || careHomes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* 1. HEADER SECTION */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Need Organizer</span>
            <span>·</span>
            <span>One Message to Actionable Requests</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
          Tell us what your care home needs.{' '}
          <span className="text-teal-700">We'll organize it.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          Describe multiple needs naturally in simple sentences. CareConnect turns them into clear, actionable support requests for donors and volunteers.
        </p>
      </div>

      {/* Visual Transformation Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white rounded-3xl shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <span className="font-bold text-teal-300 uppercase tracking-wider text-[11px] block">
                How It Works
              </span>
              <span className="text-slate-300">
                <strong>ONE MESSAGE</strong> → <strong>AI ORGANIZES ITEMS</strong> → <strong>COMMUNITY ACTION</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Care-home staff review and approve every request before publishing</span>
          </div>
        </div>
      </div>

      {/* 2. CARE HOME CONTEXT & INPUT AREA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Care Home Context
            </label>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <select
                value={selectedHomeId}
                onChange={e => setSelectedHomeId(e.target.value)}
                className="text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {careHomes.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.location} · {h.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                isVoiceRecording
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-300'
                  : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
              }`}
              title={isVoiceRecording ? 'Click to stop recording' : 'Dictate your needs using your microphone'}
            >
              {isVoiceRecording ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-teal-700" />
                  <span>Record Voice (Mic)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Voice Recording Status */}
        {isVoiceRecording && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            <span>{voiceStatus || 'Listening... Speak clearly into your microphone.'}</span>
          </div>
        )}

        {/* Speech Error Banner */}
        {speechError && (
          <div className="flex items-center gap-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Large Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Describe your care home's needs (single sentence or messy list):
            </label>
            <span className="text-[11px] text-slate-400">
              {promptInput.length} characters
            </span>
          </div>

          <textarea
            rows={4}
            value={promptInput}
            onChange={e => setPromptInput(e.target.value)}
            placeholder="e.g. We need 15 blankets, 2 wheelchairs, a doctor for our elderly residents and someone to teach English to the children."
            className="w-full p-4 text-sm sm:text-base text-slate-900 bg-slate-50/50 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white resize-y transition-all"
          />
        </div>

        {/* Sample Prompts */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Click any example prompt to test:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {SAMPLE_AI_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPromptInput(prompt.text)}
                className="p-3 text-left bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-200 rounded-2xl text-slate-700 transition-colors group"
              >
                <div className="font-semibold text-slate-900 group-hover:text-teal-900 mb-0.5">
                  {prompt.label}
                </div>
                <div className="text-slate-500 line-clamp-1 italic text-[11px]">
                  "{prompt.text}"
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-teal-700 shrink-0" />
            <span>No final medical, legal, or financial decisions are made by AI.</span>
          </div>

          <button
            onClick={handleOrganizeWithAI}
            disabled={isProcessing || !promptInput.trim()}
            className="w-full sm:w-auto px-8 py-3.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Organizing with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Organize with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. AI PROCESSING STATE */}
      {isProcessing && (
        <div className="bg-white rounded-3xl p-8 border border-teal-200 shadow-sm text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Structuring Care Home Requests</h3>
            <p className="text-xs text-teal-800 font-medium mt-1 font-mono">
              {processingStep || 'Processing natural language input...'}
            </p>
          </div>
          <div className="w-full max-w-md mx-auto h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full w-2/3 animate-indeterminate"></div>
          </div>
        </div>
      )}

      {/* 4. RESULTS & HUMAN REVIEW SECTION */}
      {extractedItems.length > 0 && !isProcessing && (
        <div className="space-y-6">
          {/* Section banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="text-xl font-bold text-slate-900">
                    Step 3: Human Review & Publication
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {aiSummary}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                  {engineSource}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {extractedItems.length} items extracted
                </span>
              </div>
            </div>

            {/* Crucial Human Review Requirement Banner */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Safety Policy:</strong> AI-generated suggestions should be reviewed by authorized care-home staff before publishing. You can edit quantities, change categories, or remove requests below.
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {extractedItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`bg-white rounded-3xl p-6 border shadow-sm transition-all space-y-4 ${
                  item.approved !== false
                    ? 'border-slate-200 hover:border-teal-300'
                    : 'border-slate-200/50 opacity-60 bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ index: idx, data: { ...item } })}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit item details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove this item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Structured Metadata Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Category</span>
                    <span className="font-semibold text-slate-800">{item.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Beneficiary</span>
                    <span className="font-semibold text-slate-800">{item.beneficiary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Quantity</span>
                    <span className="font-semibold text-slate-800">{item.quantity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Priority</span>
                    <span
                      className={`font-semibold ${
                        item.priority === 'High'
                          ? 'text-rose-700'
                          : item.priority === 'Medium'
                          ? 'text-amber-700'
                          : 'text-slate-700'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Support Type</span>
                    <span className="font-semibold text-teal-800">{item.supportType}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Suggested Supporter</span>
                    <span className="text-slate-700">{item.suggestedSupporter}</span>
                  </div>
                </div>

                {/* Reason */}
                {item.reason && (
                  <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-100">
                    <strong>AI Rationale:</strong> {item.reason}
                  </div>
                )}

                {/* Approval toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    {item.approved !== false ? 'Approved by staff' : 'Excluded from publish'}
                  </span>
                  <button
                    onClick={() => handleToggleApproval(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      item.approved !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{item.approved !== false ? 'Approved' : 'Click to Include'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Publishing Bar */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-lg font-bold">Approve & Publish to Active Needs</h4>
              <p className="text-xs text-slate-300">
                Ready to commit {extractedItems.filter(i => i.approved !== false).length} approved requirements to <strong>{activeHome.name}</strong>.
              </p>
            </div>

            <button
              onClick={handlePublishAllApproved}
              disabled={extractedItems.filter(i => i.approved !== false).length === 0}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Publish Approved Requests</span>
            </button>
          </div>

          {/* Success Notification */}
          {publishedCount !== null && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 text-emerald-950 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold">
                    Successfully Published {publishedCount} Needs!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    These requests are now live and visible to supporters on the <strong>Find a Need</strong> page and recorded in <strong>{activeHome.name}</strong>'s dashboard.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={onNeedsPublished}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  View Active Needs Feed
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Edit AI-Generated Requirement</h3>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirement Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.data.title}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.data.description}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, description: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingItem.data.category}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, category: e.target.value as CategoryType },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    {[
                      'Education',
                      'Healthcare',
                      'Essentials',
                      'Accessibility',
                      'Food',
                      'Clothing',
                      'Companionship',
                      'Skills & Mentorship',
                      'Infrastructure',
                      'Activities',
                      'Volunteer',
                      'Other',
                    ].map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Beneficiary</label>
                  <select
                    value={editingItem.data.beneficiary}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, beneficiary: e.target.value as BeneficiaryType },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    {['Children', 'Elderly', 'Both', 'Care Home'].map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={editingItem.data.quantity}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, quantity: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={editingItem.data.priority}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, priority: e.target.value as PriorityType },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  >
                    {['High', 'Medium', 'Low'].map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Support Type</label>
                <select
                  value={editingItem.data.supportType}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, supportType: e.target.value as SupportType },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                >
                  {[
                    'Donate Items',
                    'Volunteer',
                    'Provide a Service',
                    'Provide Equipment',
                    'Sponsor a Need',
                  ].map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};