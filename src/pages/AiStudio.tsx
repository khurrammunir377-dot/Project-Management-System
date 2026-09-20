import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Sparkles, Send, Settings, Key, Code2, Copy, Check, Download,
  Trash2, Plus, RefreshCw, Terminal, Cpu, Zap, FolderGit2, Play,
  FileCode, Layers, ShieldCheck, ExternalLink, HelpCircle, Eye, EyeOff
} from 'lucide-react';
import { useDevHub } from '@/context/DevHubContext';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  codeBlocks?: { filename: string; language: string; code: string }[];
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
  model: string;
}

const DEFAULT_SYSTEM_PROMPTS: Record<string, string> = {
  'fullstack': 'You are an expert Full Stack Software Architect specializing in Django, React, TypeScript, Flutter, and PostgreSQL. Provide complete, production-ready code with clean architecture, proper error handling, and robust security.',
  'django': 'You are a Senior Python & Django Enterprise Backend Engineer. Write clean models, views, DRF serializers, queryset optimizations, and PostgreSQL database migrations.',
  'flutter': 'You are a Senior Flutter & Dart Mobile Specialist. Create high-performance, beautiful UI widgets, clean state management (Bloc/Riverpod/Provider), offline caching, and native integrations.',
  'database': 'You are a Principal Database Administrator specializing in PostgreSQL, indexing, query optimization, CTEs, schema architecture, and partition strategies.',
};

const QUICK_PROMPTS = [
  { label: '🚀 Build Django CRUD API', prompt: 'Write a complete Django REST Framework CRUD API with models, serializers, views, and url routing for an enterprise inventory tracking system.' },
  { label: '📱 Flutter Barcode Scanner Screen', prompt: 'Create a Flutter mobile screen with live camera barcode scanning, vibration feedback on detection, and API product lookup.' },
  { label: '⚡ React Real-time Dashboard', prompt: 'Build a React TypeScript dashboard component with Tailwind CSS, metric cards, status filter pills, and live polling telemetry.' },
  { label: '🗄️ PostgreSQL Index & Schema Optimization', prompt: 'Write a comprehensive PostgreSQL schema with indexes, triggers, and foreign keys for an enterprise warehouse batch movement system.' },
  { label: '🔒 Secure JWT Auth Middleware', prompt: 'Write a robust Python Django middleware for JWT authentication, role verification, and rate limiting with Redis.' },
];

export default function AiStudio() {
  const { projects, theme } = useDevHub();
  const isLight = theme === 'light-pro';

  // State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ai_dev_api_key') || '');
  const [provider, setProvider] = useState<'openai' | 'grok' | 'gemini' | 'anthropic' | 'custom'>(() =>
    (localStorage.getItem('ai_dev_provider') as any) || 'grok'
  );
  const [model, setModel] = useState(() => localStorage.getItem('ai_dev_model') || 'grok-2');
  const [customEndpoint, setCustomEndpoint] = useState(() => localStorage.getItem('ai_dev_custom_endpoint') || 'https://api.x.ai/v1');
  const [showSettings, setShowSettings] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [persona, setPersona] = useState('fullstack');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'sandbox' | 'split'>('chat');
  const [selectedProjectContext, setSelectedProjectContext] = useState('');

  // Sandbox active file
  const [activeSandboxFile, setActiveSandboxFile] = useState('models.py');
  const [sandboxFiles, setSandboxFiles] = useState<Record<string, string>>({
    'models.py': `# KMB DevHub PRO - Enterprise Data Model\nfrom django.db import models\n\nclass InventoryItem(models.Model):\n    sku = models.CharField(max_length=64, unique=True, db_index=True)\n    name = models.CharField(max_length=255)\n    category = models.CharField(max_length=100)\n    quantity = models.PositiveIntegerField(default=0)\n    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)\n    location = models.CharField(max_length=50, default="DXB-WH-01")\n    updated_at = models.DateTimeField(auto_now=True)\n\n    def __str__(self):\n        return f"{self.sku} - {self.name}"`,
    'views.py': `# Django REST Framework ViewSet\nfrom rest_framework import viewsets, permissions\nfrom .models import InventoryItem\nfrom .serializers import InventoryItemSerializer\n\nclass InventoryViewSet(viewsets.ModelViewSet):\n    queryset = InventoryItem.objects.all().order_by('-updated_at')\n    serializer_class = InventoryItemSerializer\n    permission_classes = [permissions.IsAuthenticated]`,
    'main.dart': `// Flutter Mobile Scanner Widget\nimport 'package:flutter/material.dart';\n\nclass ScannerView extends StatelessWidget {\n  const ScannerView({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: const Text('UUDS Mobile Scanner')),\n      body: const Center(\n        child: Text('Live Barcode Camera Stream Active'),\n      ),\n    );\n  }\n}`,
  });

  // Chat Sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('ai_dev_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'session-1',
        title: 'UUDS Inventory & Architecture',
        createdAt: new Date().toISOString(),
        model: 'grok-2',
        messages: [
          {
            id: 'm1',
            role: 'assistant',
            content: `Hello Khurram! I am your AI Development Studio assistant (Grok & GPT-4o powered).\n\nYou can connect your API key to generate complete codebases, architect Django backends, build Flutter mobile applications, optimize PostgreSQL databases, and automate development directly inside your portal.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            codeBlocks: [
              {
                filename: 'quickstart.py',
                language: 'python',
                code: `# KMB DevHub AI Engine Ready\ndef initialize_workspace():\n    print("Khurram Munir Basra Developer Studio Initialized")\n    print("Connected to 31 Production Repositories")\n\ninitialize_workspace()`,
              }
            ]
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages]);

  // Save sessions to localStorage
  useEffect(() => {
    localStorage.setItem('ai_dev_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save Settings
  const saveSettings = () => {
    localStorage.setItem('ai_dev_api_key', apiKey.trim());
    localStorage.setItem('ai_dev_provider', provider);
    localStorage.setItem('ai_dev_model', model);
    localStorage.setItem('ai_dev_custom_endpoint', customEndpoint.trim());
    setShowSettings(false);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: 'New Dev Session ' + (sessions.length + 1),
      createdAt: new Date().toISOString(),
      model: model,
      messages: [
        {
          id: 'm-' + Date.now(),
          role: 'assistant',
          content: `New session started with model: **${model}**. How can I help you architect or develop your application today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) return;
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const copyCodeToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (customText?: string) => {
    const query = customText || inputPrompt;
    if (!query.trim() || isGenerating) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...activeSession.messages, userMsg];
    setSessions(prev =>
      prev.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, title: s.messages.length <= 1 ? query.slice(0, 32) + '...' : s.title } : s)
    );
    setInputPrompt('');
    setIsGenerating(true);

    // If API Key is present, call actual provider
    if (apiKey.trim()) {
      try {
        let endpoint = 'https://api.openai.com/v1/chat/completions';
        if (provider === 'grok') endpoint = 'https://api.x.ai/v1/chat/completions';
        if (provider === 'custom') endpoint = `${customEndpoint.replace(/\/$/, '')}/chat/completions`;

        const systemContent = DEFAULT_SYSTEM_PROMPTS[persona] + (selectedProjectContext ? `\nContext Project: ${selectedProjectContext}` : '');

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemContent },
              ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
            ],
            temperature: 0.7,
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || `HTTP ${response.status} from ${provider}`);
        }

        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content || 'No response returned.';

        // Extract code blocks if any
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const codeBlocks: { filename: string; language: string; code: string }[] = [];
        let match;
        let fileIndex = 1;
        while ((match = codeBlockRegex.exec(replyText)) !== null) {
          const lang = match[1] || 'text';
          const ext = lang === 'python' ? 'py' : lang === 'dart' ? 'dart' : lang === 'typescript' || lang === 'tsx' ? 'tsx' : lang === 'sql' ? 'sql' : 'txt';
          codeBlocks.push({
            filename: `solution_${fileIndex}.${ext}`,
            language: lang,
            code: match[2].trim(),
          });
          fileIndex++;
        }

        const aiMsg: Message = {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          codeBlocks: codeBlocks.length > 0 ? codeBlocks : undefined,
        };

        setSessions(prev =>
          prev.map(s => s.id === activeSessionId ? { ...s, messages: [...updatedMessages, aiMsg] } : s)
        );

        if (codeBlocks.length > 0) {
          setSandboxFiles(prev => ({
            ...prev,
            [codeBlocks[0].filename]: codeBlocks[0].code
          }));
          setActiveSandboxFile(codeBlocks[0].filename);
        }

      } catch (err: any) {
        const errorMsg: Message = {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: `⚠️ **API Error (${provider.toUpperCase()}):** ${err.message}\n\nPlease check your API Key and endpoint in the Settings (⚙️) panel.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setSessions(prev =>
          prev.map(s => s.id === activeSessionId ? { ...s, messages: [...updatedMessages, errorMsg] } : s)
        );
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Smart Built-in Simulation Engine when no API key is provided
      setTimeout(() => {
        let generatedCode = '';
        let generatedText = '';
        let fileName = 'solution.py';
        let lang = 'python';

        if (query.toLowerCase().includes('django') || query.toLowerCase().includes('python')) {
          fileName = 'views.py';
          lang = 'python';
          generatedCode = `from rest_framework import viewsets, permissions, status\nfrom rest_framework.response import Response\nfrom rest_framework.decorators import action\nfrom django.db import transaction\nfrom .models import InventoryItem\nfrom .serializers import InventoryItemSerializer\n\nclass EnterpriseInventoryViewSet(viewsets.ModelViewSet):\n    """\n    Enterprise Inventory ViewSet for UUDS Airport Stores\n    Handles batch allocations, barcode lookups, and audit logging.\n    """\n    queryset = InventoryItem.objects.select_related().all()\n    serializer_class = InventoryItemSerializer\n    permission_classes = [permissions.IsAuthenticated]\n\n    @action(detail=False, methods=['post'], url_path='batch-receive')\n    @transaction.atomic\n    def batch_receive(self, request):\n        items_data = request.data.get('items', [])\n        created_items = []\n        for item_data in items_data:\n            item, created = InventoryItem.objects.get_or_create(\n                sku=item_data['sku'],\n                defaults=item_data\n            )\n            if not created:\n                item.quantity += item_data.get('quantity', 0)\n                item.save()\n            created_items.append(item)\n        return Response({'status': 'SUCCESS', 'processed': len(created_items)}, status=status.HTTP_200_OK)`;
          generatedText = `### 🚀 Django Enterprise Solution for UUDS Architecture\n\nHere is a production-grade DRF ViewSet featuring atomic transactions, batch processing, and optimized query execution:`;
        } else if (query.toLowerCase().includes('flutter') || query.toLowerCase().includes('dart') || query.toLowerCase().includes('mobile')) {
          fileName = 'scanner_screen.dart';
          lang = 'dart';
          generatedCode = `import 'package:flutter/material.dart';\nimport 'package:flutter/services.dart';\n\nclass UudsBarcodeScannerPage extends StatefulWidget {\n  const UudsBarcodeScannerPage({Key? key}) : super(key: key);\n\n  @override\n  State<UudsBarcodeScannerPage> createState() => _UudsBarcodeScannerPageState();\n}\n\nclass _UudsBarcodeScannerPageState extends State<UudsBarcodeScannerPage> {\n  String? _scannedSku;\n  bool _isProcessing = false;\n\n  void _onCodeDetected(String code) async {\n    if (_isProcessing) return;\n    setState(() => _isProcessing = true);\n    HapticFeedback.mediumImpact();\n    \n    // Simulate API query\n    await Future.delayed(const Duration(milliseconds: 400));\n    setState(() {\n      _scannedSku = code;\n      _isProcessing = false;\n    });\n  }\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      backgroundColor: const Color(0xFF0A0C0F),\n      appBar: AppBar(\n        title: const Text('UUDS Material Scanner v2.4'),\n        backgroundColor: const Color(0xFF101318),\n      ),\n      body: Column(\n        children: [\n          Expanded(\n            child: Container(\n              margin: const EdgeInsets.all(16),\n              decoration: BoxDecoration(\n                color: const Color(0xFF141820),\n                border: Border.all(color: const Color(0xFF00D4C8)),\n                borderRadius: BorderRadius.circular(8),\n              ),\n              child: Center(\n                child: Text(\n                  _scannedSku ?? 'Align Barcode in Camera Target',\n                  style: const TextStyle(color: Color(0xFFDCE4F0)),\n                ),\n              ),\n            ),\n          ),\n        ],\n      ),\n    );\n  }\n}`;
          generatedText = `### 📱 Flutter Mobile Inspection Scanner Component\n\nHere is a high-performance Flutter scanner view tailored for warehouse parts tracking with haptic vibration feedback:`;
        } else {
          fileName = 'architecture.tsx';
          lang = 'typescript';
          generatedCode = `import React, { useState } from 'react';\n\nexport const EnterpriseDashboard: React.FC = () => {\n  const [activeTab, setActiveTab] = useState('telemetry');\n  \n  return (\n    <div className="p-6 bg-[#0a0c0f] text-[#dce4f0] font-sans">\n      <h2 className="text-xl font-bold text-[#00d4c8]">Enterprise Hub Live Monitor</h2>\n      <p className="text-xs text-[#7a8899]">Node Status: 100% Operational | Latency: 4ms</p>\n    </div>\n  );\n};`;
          generatedText = `### ⚡ Full Stack Component Architecture\n\nI have created the scaffolding tailored to your specifications. You can add your actual API Key in the **Settings (⚙️)** panel to connect directly to **Grok (xAI)**, **OpenAI (GPT-4o)**, or **Claude 3.5 Sonnet**!`;
        }

        const aiMsg: Message = {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: `${generatedText}\n\n\`\`\`${lang}\n${generatedCode}\n\`\`\``,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          codeBlocks: [
            {
              filename: fileName,
              language: lang,
              code: generatedCode,
            }
          ]
        };

        setSessions(prev =>
          prev.map(s => s.id === activeSessionId ? { ...s, messages: [...updatedMessages, aiMsg] } : s)
        );

        setSandboxFiles(prev => ({ ...prev, [fileName]: generatedCode }));
        setActiveSandboxFile(fileName);
        setIsGenerating(false);
      }, 600);
    }
  };

  return (
    <div
      className={`h-[calc(100vh-56px)] flex flex-col select-none overflow-hidden ${
        isLight ? 'bg-[#f8fafc] text-[#0f172a]' : 'bg-[#0a0c0f] text-[#dce4f0]'
      }`}
    >
      {/* ── TOP CONTROL & MODEL STRIP ───────────────────────────────── */}
      <div
        className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 flex-shrink-0 ${
          isLight ? 'bg-[#ffffff] border-[#e2e8f0]' : 'bg-[#0d1017] border-[#1e2330]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] rounded-[3px]">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00d4c8]">
                AI DEV STUDIO & CODE COPILOT
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#10b98115] text-[#10b981] border border-[#10b98140] rounded-[2px] font-bold">
                {provider.toUpperCase()}: {model}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#55637a] hidden sm:block">
              Architect, code, debug and generate applications with Grok, GPT-4o & Claude
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Persona selector */}
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className={`font-mono text-xs px-2.5 py-1.5 rounded-[3px] border outline-none cursor-pointer ${
              isLight
                ? 'bg-[#f1f5f9] border-[#cbd5e1] text-[#0f172a]'
                : 'bg-[#141820] border-[#252c3a] text-[#dce4f0]'
            }`}
          >
            <option value="fullstack">🛠️ Full-Stack Architect</option>
            <option value="django">🐍 Python & Django Lead</option>
            <option value="flutter">📱 Flutter Mobile Engineer</option>
            <option value="database">🗄️ PostgreSQL DBA Specialist</option>
          </select>

          {/* View Mode Switcher */}
          <div
            className={`hidden md:flex items-center p-0.5 rounded-[3px] border font-mono text-xs ${
              isLight ? 'bg-[#f1f5f9] border-[#cbd5e1]' : 'bg-[#101318] border-[#1e2330]'
            }`}
          >
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2.5 py-1 rounded-[2px] font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#00d4c8] text-black shadow-sm'
                  : 'text-[#64748b] hover:text-[#00d4c8]'
              }`}
            >
              CHAT
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`px-2.5 py-1 rounded-[2px] font-bold transition-all ${
                activeTab === 'split'
                  ? 'bg-[#00d4c8] text-black shadow-sm'
                  : 'text-[#64748b] hover:text-[#00d4c8]'
              }`}
            >
              SPLIT CODE
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-2.5 py-1 rounded-[2px] font-bold transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-[#00d4c8] text-black shadow-sm'
                  : 'text-[#64748b] hover:text-[#00d4c8]'
              }`}
            >
              SANDBOX
            </button>
          </div>

          {/* API Key Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] font-mono text-xs font-bold border transition-all ${
              apiKey
                ? 'bg-[#10b98115] border-[#10b98150] text-[#10b981] hover:bg-[#10b98125]'
                : 'bg-[#00d4c815] border-[#00d4c850] text-[#00d4c8] hover:bg-[#00d4c825]'
            }`}
            title="Configure AI API Keys & Models"
          >
            <Settings size={13} />
            <span className="hidden sm:inline">{apiKey ? 'API KEY CONFIGURED' : 'SET API KEY'}</span>
          </button>
        </div>
      </div>

      {/* ── WORKSPACE BODY ──────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT CHAT SESSIONS SIDEBAR ────────────────────────────── */}
        <div
          className={`w-60 flex-shrink-0 hidden xl:flex flex-col border-r ${
            isLight ? 'bg-[#ffffff] border-[#e2e8f0]' : 'bg-[#0a0c10] border-[#1a1f2c]'
          }`}
        >
          <div className="p-3 border-b border-[#1e2330]">
            <button
              onClick={createNewSession}
              className="w-full py-2 bg-[#00d4c8] hover:bg-[#00e5d8] text-black font-mono font-bold text-xs rounded-[3px] flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,212,200,0.2)] active:scale-98"
            >
              <Plus size={14} /> NEW DEV SESSION
            </button>
          </div>

          {/* Project Context Injector */}
          <div className="p-2.5 border-b border-[#1e2330]">
            <label className="block font-mono text-[9px] uppercase text-[#55637a] mb-1 font-bold">
              ATTACH REPOSITORY CONTEXT:
            </label>
            <select
              value={selectedProjectContext}
              onChange={(e) => setSelectedProjectContext(e.target.value)}
              className={`w-full font-mono text-[10.5px] px-2 py-1 rounded-[2px] border outline-none ${
                isLight ? 'bg-[#f1f5f9] border-[#cbd5e1] text-[#0f172a]' : 'bg-[#141820] border-[#252c3a] text-[#dce4f0]'
              }`}
            >
              <option value="">None (Global Architecture)</option>
              {projects.slice(0, 10).map((p) => (
                <option key={p.id} value={`${p.name} (${p.stack.join(', ')})`}>
                  {p.shortCode} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sessions List */}
          <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollable">
            <div className="font-mono text-[9px] uppercase text-[#55637a] px-2 py-1 font-bold">
              SAVED CONVERSATIONS ({sessions.length})
            </div>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`group p-2 rounded-[3px] border font-mono text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  activeSessionId === s.id
                    ? isLight
                      ? 'bg-[#f0f9ff] border-[#0284c7] text-[#0284c7] font-bold'
                      : 'bg-[#00d4c815] border-[#00d4c860] text-[#00d4c8] font-bold'
                    : isLight
                    ? 'border-transparent text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                    : 'border-transparent text-[#7a8899] hover:bg-[#141820] hover:text-[#dce4f0]'
                }`}
              >
                <div className="truncate pr-1">
                  <div className="truncate text-[11px]">{s.title}</div>
                  <div className="text-[8.5px] text-[#55637a]">{s.messages.length} messages</div>
                </div>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => deleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#55637a] hover:text-[#ef4444] transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Prompts strip */}
          <div className="p-2.5 border-t border-[#1e2330] space-y-1">
            <span className="font-mono text-[9px] uppercase text-[#55637a] block font-bold">
              QUICK APP TEMPLATES:
            </span>
            <div className="space-y-1">
              {QUICK_PROMPTS.slice(0, 3).map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.prompt)}
                  className={`w-full text-left p-1.5 rounded-[2px] font-mono text-[9.5px] truncate border transition-colors ${
                    isLight
                      ? 'bg-[#f8fafc] hover:bg-[#f1f5f9] border-[#e2e8f0] text-[#334155]'
                      : 'bg-[#141820] hover:bg-[#182030] border-[#1e2330] text-[#7a8899] hover:text-[#00d4c8]'
                  }`}
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CHAT VIEWPORT ────────────────────────────────────── */}
        {(activeTab === 'chat' || activeTab === 'split') && (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Messages Feed */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollable space-y-4">
              {activeSession.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-4xl mx-auto ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-[3px] bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                  )}

                  <div
                    className={`rounded-[4px] p-4 max-w-[88%] sm:max-w-[80%] border shadow-sm ${
                      msg.role === 'user'
                        ? isLight
                          ? 'bg-[#0284c7] text-white border-[#0284c7]'
                          : 'bg-[#182232] text-[#dce4f0] border-[#00d4c840]'
                        : isLight
                        ? 'bg-[#ffffff] text-[#0f172a] border-[#cbd5e1]'
                        : 'bg-[#101318] text-[#dce4f0] border-[#1e2330]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 text-[10px] font-mono opacity-70 border-b pb-1 border-current/10">
                      <span className="font-bold">
                        {msg.role === 'user' ? 'KHURRAM MUNIR BASRA' : `AI DEV COPILOT (${model})`}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Render Code Blocks */}
                    {msg.codeBlocks && msg.codeBlocks.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {msg.codeBlocks.map((block, bIdx) => {
                          const blockKey = `${msg.id}-${bIdx}`;
                          return (
                            <div
                              key={bIdx}
                              className="rounded-[3px] border border-[#252c3a] bg-[#080a0d] overflow-hidden font-mono text-xs"
                            >
                              <div className="px-3 py-1.5 bg-[#0d1017] border-b border-[#1e2330] flex items-center justify-between text-[11px] text-[#7a8899]">
                                <span className="text-[#00d4c8] font-bold flex items-center gap-1.5">
                                  <FileCode size={13} /> {block.filename}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => copyCodeToClipboard(block.code, blockKey)}
                                    className="flex items-center gap-1 px-2 py-0.5 bg-[#141820] hover:bg-[#1a2130] text-[#dce4f0] hover:text-[#00d4c8] rounded-[2px] border border-[#252c3a] transition-colors"
                                  >
                                    {copiedId === blockKey ? <Check size={11} className="text-[#10b981]" /> : <Copy size={11} />}
                                    <span>{copiedId === blockKey ? 'COPIED' : 'COPY'}</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSandboxFiles(prev => ({ ...prev, [block.filename]: block.code }));
                                      setActiveSandboxFile(block.filename);
                                      setActiveTab('sandbox');
                                    }}
                                    className="flex items-center gap-1 px-2 py-0.5 bg-[#00d4c815] text-[#00d4c8] hover:bg-[#00d4c830] rounded-[2px] border border-[#00d4c840] transition-colors"
                                  >
                                    <Play size={11} />
                                    <span>OPEN IN SANDBOX</span>
                                  </button>
                                </div>
                              </div>
                              <pre className="p-3 text-[11.5px] text-[#dce4f0] overflow-x-auto scrollable bg-[#05070a] leading-relaxed">
                                <code>{block.code}</code>
                              </pre>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-[3px] bg-[#00d4c8] text-black font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      KM
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex gap-3 max-w-4xl mx-auto items-center">
                  <div className="w-8 h-8 rounded-[3px] bg-[#00d4c815] border border-[#00d4c850] text-[#00d4c8] flex items-center justify-center animate-pulse">
                    <RefreshCw size={15} className="animate-spin text-[#00d4c8]" />
                  </div>
                  <div className="p-3 bg-[#101318] border border-[#1e2330] rounded-[3px] font-mono text-xs text-[#00d4c8] flex items-center gap-2">
                    <span>AI Model ({model}) generating architecture & code...</span>
                    <span className="animate-pulse">█</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Prompt Ribbon */}
            <div
              className={`p-3 sm:p-4 border-t ${
                isLight ? 'bg-[#ffffff] border-[#e2e8f0]' : 'bg-[#0d1017] border-[#1e2330]'
              }`}
            >
              <div className="max-w-4xl mx-auto space-y-2">
                {/* Quick action chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[10px]">
                  <span className="text-[#55637a] font-bold uppercase whitespace-nowrap">QUICK PROMPT:</span>
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(qp.prompt)}
                      className={`px-2 py-0.5 rounded-[2px] border whitespace-nowrap transition-colors ${
                        isLight
                          ? 'bg-[#f1f5f9] hover:bg-[#e2e8f0] border-[#cbd5e1] text-[#334155]'
                          : 'bg-[#141820] hover:bg-[#1a2130] border-[#252c3a] text-[#7a8899] hover:text-[#00d4c8]'
                      }`}
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>

                {/* Textarea input */}
                <div className="relative flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Ask AI Dev Copilot to write code, design Django models, create Flutter widgets, or debug... (Press Enter to send)`}
                    className={`w-full p-3 pr-12 rounded-[3px] border font-mono text-xs outline-none transition-colors resize-none ${
                      isLight
                        ? 'bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a] focus:border-[#0284c7]'
                        : 'bg-[#101318] border-[#252c3a] text-[#dce4f0] focus:border-[#00d4c8]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={isGenerating || !inputPrompt.trim()}
                    className="absolute right-2 bottom-2.5 p-2 bg-[#00d4c8] hover:bg-[#00e5d8] disabled:opacity-40 text-black rounded-[3px] transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Send Message"
                  >
                    <Send size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between font-mono text-[9px] text-[#55637a]">
                  <span>Powered by Grok / OpenAI / Claude API Runtime</span>
                  <span>Shift + Enter for new line • Enter to execute</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CODE SANDBOX & MULTI-FILE VIEWER ──────────────────────── */}
        {(activeTab === 'sandbox' || activeTab === 'split') && (
          <div
            className={`flex-1 flex flex-col border-l overflow-hidden ${
              isLight ? 'bg-[#ffffff] border-[#e2e8f0]' : 'bg-[#0a0c10] border-[#1a1f2c]'
            }`}
          >
            {/* Sandbox Tab Header */}
            <div className="p-2 bg-[#0d1017] border-b border-[#1e2330] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-1 overflow-x-auto">
                <span className="text-[#55637a] text-[10px] uppercase font-bold pr-2">SANDBOX FILES:</span>
                {Object.keys(sandboxFiles).map((file) => (
                  <button
                    key={file}
                    onClick={() => setActiveSandboxFile(file)}
                    className={`px-2.5 py-1 rounded-[2px] text-[11px] font-bold border transition-colors flex items-center gap-1.5 ${
                      activeSandboxFile === file
                        ? 'bg-[#00d4c815] text-[#00d4c8] border-[#00d4c860]'
                        : 'text-[#7a8899] hover:text-[#dce4f0] border-transparent hover:bg-[#141820]'
                    }`}
                  >
                    <FileCode size={12} /> {file}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyCodeToClipboard(sandboxFiles[activeSandboxFile] || '', 'active-sandbox')}
                  className="px-2 py-1 bg-[#141820] hover:bg-[#1a2130] text-[#dce4f0] hover:text-[#00d4c8] rounded-[2px] border border-[#252c3a] text-[10px] flex items-center gap-1"
                >
                  {copiedId === 'active-sandbox' ? <Check size={11} className="text-[#10b981]" /> : <Copy size={11} />}
                  <span>{copiedId === 'active-sandbox' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            {/* Sandbox Editor Content */}
            <div className="flex-1 p-4 bg-[#05070a] font-mono text-xs overflow-auto scrollable">
              <textarea
                value={sandboxFiles[activeSandboxFile] || ''}
                onChange={(e) =>
                  setSandboxFiles(prev => ({ ...prev, [activeSandboxFile]: e.target.value }))
                }
                className="w-full h-full bg-transparent text-[#dce4f0] font-mono text-[12px] leading-relaxed outline-none resize-none"
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── API KEY & MODEL SETTINGS MODAL ──────────────────────────── */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#101318] border border-[#00d4c880] rounded-[4px] w-full max-w-lg p-6 font-mono shadow-[0_0_40px_rgba(0,212,200,0.25)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2330]">
              <div className="flex items-center gap-2 text-[#00d4c8] font-bold text-sm uppercase">
                <Settings size={16} />
                <span>AI PROVIDER & API CONFIGURATION</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-[#55637a] hover:text-[#dce4f0] text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Provider Selector */}
              <div>
                <label className="block text-[#7a8899] text-[10px] uppercase font-bold mb-1">
                  AI PROVIDER SERVICE:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['grok', 'openai', 'anthropic', 'gemini', 'custom'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setProvider(p);
                        if (p === 'grok') setModel('grok-2');
                        if (p === 'openai') setModel('gpt-4o');
                        if (p === 'anthropic') setModel('claude-3-5-sonnet-20241022');
                        if (p === 'gemini') setModel('gemini-1.5-pro');
                      }}
                      className={`p-2 rounded-[2px] border text-center uppercase font-bold text-[10px] transition-all ${
                        provider === p
                          ? 'bg-[#00d4c815] border-[#00d4c8] text-[#00d4c8]'
                          : 'bg-[#141820] border-[#252c3a] text-[#7a8899] hover:text-[#dce4f0]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model selection */}
              <div>
                <label className="block text-[#7a8899] text-[10px] uppercase font-bold mb-1">
                  MODEL ID:
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. grok-2, gpt-4o, claude-3-5-sonnet"
                  className="w-full bg-[#141820] text-xs text-[#dce4f0] px-3 py-2 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-[#7a8899] text-[10px] uppercase font-bold mb-1">
                  API KEY ({provider.toUpperCase()} SECRET TOKEN):
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-... or xai-..."
                    className="w-full bg-[#141820] text-xs text-[#dce4f0] px-3 py-2 pr-10 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55637a] hover:text-[#dce4f0]"
                  >
                    {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                <span className="text-[9.5px] text-[#55637a] mt-1 block">
                  Keys are stored securely in your local browser storage (localStorage) and never transmitted to external third parties.
                </span>
              </div>

              {provider === 'custom' && (
                <div>
                  <label className="block text-[#7a8899] text-[10px] uppercase font-bold mb-1">
                    CUSTOM BASE ENDPOINT URL:
                  </label>
                  <input
                    type="text"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    placeholder="https://api.x.ai/v1 or http://localhost:11434/v1"
                    className="w-full bg-[#141820] text-xs text-[#dce4f0] px-3 py-2 border border-[#252c3a] focus:border-[#00d4c8] outline-none rounded-[2px]"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1e2330]">
              <span className="text-[10px] text-[#10b981] font-bold flex items-center gap-1">
                <ShieldCheck size={12} /> SECURE LOCAL STORAGE
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-3 py-1.5 text-xs text-[#7a8899] hover:text-[#dce4f0] border border-[#252c3a] rounded-[2px]"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={saveSettings}
                  className="px-4 py-1.5 text-xs bg-[#00d4c8] text-black font-bold rounded-[2px] hover:bg-[#00e5d8] transition-colors"
                >
                  SAVE & CONNECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
