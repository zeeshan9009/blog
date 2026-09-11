import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Key, 
  Webhook, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Zap,
  Server
} from 'lucide-react';
import { ApiKey, WebhookEndpoint } from '../types/models';

export const DeveloperPortalView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'keys' | 'playground' | 'webhooks' | 'sdks'>('playground');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [keyEnv, setKeyEnv] = useState<'production' | 'sandbox'>('production');
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Playground state
  const [endpoint, setEndpoint] = useState<'mint_passport' | 'verify_passport' | 'register_warranty' | 'report_fraud'>('mint_passport');
  const [httpMethod, setHttpMethod] = useState<'POST' | 'GET'>('POST');
  const [requestBody, setRequestBody] = useState<string>(`{
  "sku": "HR-AC-HSU-18HNS",
  "name": "Haier Thunder Inverter 1.5 Ton T3 AC",
  "brand": "Haier Pakistan",
  "category": "Appliances",
  "serialNumber": "HR-AC-2026-99120",
  "batchNumber": "LOT-2026-PAK-04",
  "originCountry": "Pakistan",
  "warrantyMonths": 24
}`);
  const [responsePayload, setResponsePayload] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLang, setSdkLang] = useState<'curl' | 'node' | 'python' | 'go'>('curl');

  // Webhook state
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  useEffect(() => {
    const defaultKeys: ApiKey[] = [
      {
        id: 'key-1',
        name: 'Haier Master ERP Production Gateway',
        keyPrefix: 'sk_live_9f82',
        secretMasked: 'sk_live_9f82••••••••••••••••34a1',
        createdAt: '2026-01-15',
        lastUsedAt: 'Just now (12s ago)',
        requestsCount: 248190,
        environment: 'production',
        status: 'active'
      },
      {
        id: 'key-2',
        name: 'Staging & QA Test Nonce',
        keyPrefix: 'sk_test_11ac',
        secretMasked: 'sk_test_11ac••••••••••••••••99ef',
        createdAt: '2026-03-01',
        lastUsedAt: '2 hours ago',
        requestsCount: 1420,
        environment: 'sandbox',
        status: 'active'
      }
    ];
    setApiKeys(defaultKeys);

    const defaultWebhooks: WebhookEndpoint[] = [
      {
        id: 'wh-1',
        url: 'https://api.haier.com.pk/webhooks/veripass-events',
        events: ['passport.minted', 'fraud.flagged', 'warranty.claimed'],
        secret: 'whsec_99182aefb71239',
        status: 'active',
        createdAt: '2026-02-01',
        successfulDispatches: 18412,
        failedDispatches: 0
      }
    ];
    setWebhooks(defaultWebhooks);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHex = Math.random().toString(36).substring(2, 10);
    const prefix = keyEnv === 'production' ? 'sk_live_' : 'sk_test_';
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      keyPrefix: `${prefix}${randomHex.slice(0, 4)}`,
      secretMasked: `${prefix}${randomHex.slice(0, 4)}••••••••••••••••${randomHex.slice(4, 8)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsedAt: 'Never',
      requestsCount: 0,
      environment: keyEnv,
      status: 'active'
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setShowKeyModal(false);
  };

  const handleRunPlayground = () => {
    setIsLoading(true);
    setResponsePayload(null);

    setTimeout(() => {
      setIsLoading(false);
      if (endpoint === 'mint_passport') {
        setResponsePayload(JSON.stringify({
          status: 201,
          message: "Product Passport successfully minted to VeriPass Cryptographic Registry",
          data: {
            id: "VP-HR-AC-2026-99120",
            passportHash: "0x4b78c910e19a4f21bb882901efac98124b89ff01ac449a8f4c12e84d71b3392f",
            passportUrl: "https://useveripass.com/p/VP-HR-AC-2026-99120",
            qrCodeMatrixUrl: "https://useveripass.com/qr/VP-HR-AC-2026-99120.svg",
            lifecycleState: "MANUFACTURED",
            warrantyBond: {
              active: true,
              durationMonths: 24,
              validUntil: "2028-09-11"
            },
            mintedAt: new Date().toISOString()
          }
        }, null, 2));
      } else if (endpoint === 'verify_passport') {
        setResponsePayload(JSON.stringify({
          status: 200,
          authenticated: true,
          verificationScore: "1.00 (Tamper-Proof)",
          data: {
            productId: "VP-2026-8F4K29",
            name: "Solitaire 18K White Gold Diamond Ring",
            brand: "VeriPass Horology & Jewelry",
            status: "verified",
            currentOwner: "Sophia Al-Mansoor",
            warrantyActive: true,
            totalScans: 143,
            flaggedFraud: false
          }
        }, null, 2));
      } else if (endpoint === 'register_warranty') {
        setResponsePayload(JSON.stringify({
          status: 200,
          message: "Warranty registered and locked to customer digital ID",
          data: {
            warrantyId: "WAR-2026-9912",
            customerId: "CUST-99214",
            customerName: "Muhammad Bilal Khan",
            coverageDurationMonths: 24,
            status: "active"
          }
        }, null, 2));
      } else {
        setResponsePayload(JSON.stringify({
          status: 201,
          message: "Security incident report logged into Enterprise Threat Center",
          data: {
            incidentId: "FRAUD-2026-994",
            severity: "critical",
            action: "Dispatched to Brand Security Officers"
          }
        }, null, 2));
      }
    }, 600);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;

    const newWh: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: webhookUrl.trim(),
      events: ['passport.minted', 'fraud.flagged'],
      secret: `whsec_${Math.random().toString(36).substring(2, 12)}`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      successfulDispatches: 0,
      failedDispatches: 0
    };

    setWebhooks([...webhooks, newWh]);
    setWebhookUrl('');
  };

  const handleTestWebhook = (whId: string) => {
    setWebhookTestStatus('Dispatching mock payload...');
    setTimeout(() => {
      setWebhookTestStatus('✓ Mock payload dispatched (HTTP 200 OK)');
      setTimeout(() => setWebhookTestStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Code2 className="w-6 h-6 text-[#155EEF]" />
              Developer Infrastructure & API Console
            </h2>
            <span className="px-2 py-0.5 bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-[10px] font-bold uppercase">
              REST v1 & Webhooks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Programmatically mint Digital Passports from your ERP/WMS, query serial verification, and listen to real-time events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['playground', 'keys', 'webhooks', 'sdks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                activeTab === tab 
                  ? 'bg-[#155EEF] text-white border-[#155EEF]' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab === 'playground' ? 'API Playground' : tab === 'keys' ? 'API Keys' : tab === 'webhooks' ? 'Webhooks' : 'SDKs'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB: API PLAYGROUND */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Request Builder */}
          <div className="lg:col-span-6 bg-[#060D18] text-white border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-400">Interactive REST Console</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">api.useveripass.com/v1</span>
            </div>

            {/* Endpoint Selector */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-400 font-mono font-bold">SELECT ENDPOINT</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setEndpoint('mint_passport');
                    setHttpMethod('POST');
                    setRequestBody(`{\n  "sku": "HR-AC-HSU-18HNS",\n  "name": "Haier Thunder Inverter 1.5 Ton T3 AC",\n  "brand": "Haier Pakistan",\n  "serialNumber": "HR-AC-2026-99120",\n  "warrantyMonths": 24\n}`);
                  }}
                  className={`p-2 text-left font-mono text-[11px] border cursor-pointer ${
                    endpoint === 'mint_passport' 
                      ? 'border-[#155EEF] bg-blue-950/40 text-blue-300 font-bold' 
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <span className="text-emerald-400 font-bold">POST</span> /v1/products/mint
                </button>

                <button
                  onClick={() => {
                    setEndpoint('verify_passport');
                    setHttpMethod('GET');
                    setRequestBody(`// Query verification nonce for product:\n// GET /v1/verify/VP-2026-8F4K29`);
                  }}
                  className={`p-2 text-left font-mono text-[11px] border cursor-pointer ${
                    endpoint === 'verify_passport' 
                      ? 'border-[#155EEF] bg-blue-950/40 text-blue-300 font-bold' 
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <span className="text-blue-400 font-bold">GET</span> /v1/verify/:id
                </button>

                <button
                  onClick={() => {
                    setEndpoint('register_warranty');
                    setHttpMethod('POST');
                    setRequestBody(`{\n  "productId": "VP-HR-AC-000001",\n  "customerName": "Muhammad Bilal Khan",\n  "customerEmail": "bilal.khan@example.pk",\n  "dealerName": "Gulberg Flagship"\n}`);
                  }}
                  className={`p-2 text-left font-mono text-[11px] border cursor-pointer ${
                    endpoint === 'register_warranty' 
                      ? 'border-[#155EEF] bg-blue-950/40 text-blue-300 font-bold' 
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <span className="text-emerald-400 font-bold">POST</span> /v1/warranty/register
                </button>

                <button
                  onClick={() => {
                    setEndpoint('report_fraud');
                    setHttpMethod('POST');
                    setRequestBody(`{\n  "serialNumber": "HR-AC-HSU-18HNS-000001",\n  "reason": "duplicate_serial",\n  "location": "Rawalpindi"\n}`);
                  }}
                  className={`p-2 text-left font-mono text-[11px] border cursor-pointer ${
                    endpoint === 'report_fraud' 
                      ? 'border-[#155EEF] bg-blue-950/40 text-blue-300 font-bold' 
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <span className="text-red-400 font-bold">POST</span> /v1/reports/counterfeit
                </button>
              </div>
            </div>

            {/* Request Payload Editor */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-400 font-mono">
                <span>REQUEST PAYLOAD (JSON)</span>
                <span className="text-[10px] text-slate-500">Bearer sk_live_••••••••</span>
              </div>
              <textarea
                rows={7}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full bg-[#0A121E] border border-slate-800 p-3 font-mono text-xs text-emerald-300 focus:outline-none focus:border-[#155EEF] resize-none"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunPlayground}
              disabled={isLoading}
              className="w-full py-2.5 bg-[#155EEF] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Request...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Send API Request</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Response Output */}
          <div className="lg:col-span-6 bg-[#060D18] text-white border border-slate-800 p-5 space-y-4 shadow-xl min-h-[420px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  LIVE SERVER RESPONSE
                </span>
                {responsePayload && (
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-500/40">
                    HTTP 200 OK • 24ms
                  </span>
                )}
              </div>

              {!responsePayload ? (
                <div className="text-center py-20 text-slate-500 space-y-2">
                  <Server className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="font-mono text-xs">Click "Send API Request" to execute against the sandbox cluster.</p>
                </div>
              ) : (
                <pre className="bg-[#0A121E] border border-slate-800 p-3.5 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto max-h-[300px]">
                  {responsePayload}
                </pre>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between items-center">
              <span>Authentication: HMAC SHA-256</span>
              <span>Rate Limit: 10,000 req/min</span>
            </div>
          </div>

        </div>
      )}

      {/* 3. TAB: API KEYS */}
      {activeTab === 'keys' && (
        <div className="bg-white border border-slate-200 shadow-xs space-y-5 p-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-base">Active API Access Tokens</h3>
              <p className="text-xs text-slate-500 mt-0.5">Use these keys to authenticate server-to-server requests.</p>
            </div>
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3.5 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate New API Key</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Key Name</th>
                  <th className="py-3 px-4">Token Token Secret</th>
                  <th className="py-3 px-4">Environment</th>
                  <th className="py-3 px-4">Total Requests</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{k.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 px-2 py-0.5 border border-slate-200">{k.secretMasked}</span>
                        <button
                          onClick={() => handleCopy(k.secretMasked, k.id)}
                          className="text-slate-400 hover:text-slate-800 cursor-pointer"
                          title="Copy Key"
                        >
                          {copiedKey === k.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                        k.environment === 'production' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {k.environment}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {k.requestsCount.toLocaleString()} reqs
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{k.lastUsedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setApiKeys(apiKeys.filter((x) => x.id !== k.id))}
                        className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: WEBHOOKS */}
      {activeTab === 'webhooks' && (
        <div className="bg-white border border-slate-200 shadow-xs space-y-6 p-6">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-black text-slate-900 text-base">Real-Time Webhook Subscriptions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Receive immediate HTTP POST notifications whenever a scan occurs or counterfeit alert triggers.</p>
          </div>

          {/* Add Webhook Form */}
          <form onSubmit={handleAddWebhook} className="flex gap-2">
            <input
              type="url"
              required
              placeholder="https://your-domain.com/webhooks/veripass"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#155EEF]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              + Add Webhook
            </button>
          </form>

          {webhookTestStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono">
              {webhookTestStatus}
            </div>
          )}

          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div key={wh.id} className="bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs">{wh.url}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestWebhook(wh.id)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold uppercase cursor-pointer"
                    >
                      Send Test Ping
                    </button>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                      {wh.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 font-mono text-[10px] uppercase">Events Subscribed:</span>
                  {wh.events.map((ev) => (
                    <span key={ev} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                      {ev}
                    </span>
                  ))}
                  <span className="text-slate-500 text-[10px] ml-auto font-mono">
                    {wh.successfulDispatches.toLocaleString()} delivered successfully
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: SDKs */}
      {activeTab === 'sdks' && (
        <div className="bg-[#060D18] text-white border border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-white text-base">Developer SDK Integration Guides</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ready-to-use code snippets for minting and verifying product passports.</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800">
              {['curl', 'node', 'python', 'go'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSdkLang(lang as any)}
                  className={`px-3 py-1 font-mono text-xs uppercase cursor-pointer font-bold ${
                    sdkLang === lang ? 'bg-[#155EEF] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <pre className="bg-[#0A121E] border border-slate-800 p-4 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
            {sdkLang === 'curl' && `curl -X POST https://api.useveripass.com/v1/products/mint \\
  -H "Authorization: Bearer sk_live_9f82410a8b" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sku": "HR-AC-HSU-18HNS",
    "name": "Haier Thunder Inverter 1.5 Ton T3 AC",
    "brand": "Haier Pakistan",
    "serialNumber": "HR-AC-2026-99120",
    "warrantyMonths": 24
  }'`}

            {sdkLang === 'node' && `import { VeriPassClient } from '@veripass/node-sdk';

const veripass = new VeriPassClient({
  apiKey: process.env.VERIPASS_API_KEY
});

const passport = await veripass.products.mint({
  sku: 'HR-AC-HSU-18HNS',
  name: 'Haier Thunder Inverter 1.5 Ton T3 AC',
  brand: 'Haier Pakistan',
  serialNumber: 'HR-AC-2026-99120',
  warrantyMonths: 24
});

console.log('Passport URL:', passport.passportUrl);`}

            {sdkLang === 'python' && `from veripass import VeriPass

client = VeriPass(api_key="sk_live_9f82410a8b")

passport = client.products.mint(
    sku="HR-AC-HSU-18HNS",
    name="Haier Thunder Inverter 1.5 Ton T3 AC",
    brand="Haier Pakistan",
    serial_number="HR-AC-2026-99120",
    warranty_months=24
)

print(f"Verified Passport URL: {passport.url}")`}

            {sdkLang === 'go' && `package main

import (
  "context"
  "fmt"
  "github.com/veripass/veripass-go"
)

func main() {
  client := veripass.NewClient("sk_live_9f82410a8b")
  passport, err := client.Products.Mint(context.Background(), &veripass.MintParams{
    SKU:            "HR-AC-HSU-18HNS",
    Name:           "Haier Thunder Inverter 1.5 Ton T3 AC",
    SerialNumber:   "HR-AC-2026-99120",
    WarrantyMonths: 24,
  })
  if err != nil {
    panic(err)
  }
  fmt.Println("Passport Hash:", passport.PassportHash)
}`}
          </pre>
        </div>
      )}

      {/* 6. MODAL: GENERATE API KEY */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-300 max-w-md w-full p-6 text-left space-y-4 shadow-2xl rounded-none">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#155EEF]" />
                Generate Enterprise API Key
              </h3>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApiKey} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Key Name / Service Reference *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warehouse Production Line 2"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Environment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setKeyEnv('production')}
                    className={`py-2 text-center font-bold font-mono text-xs border cursor-pointer ${
                      keyEnv === 'production' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Production (Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => setKeyEnv('sandbox')}
                    className={`py-2 text-center font-bold font-mono text-xs border cursor-pointer ${
                      keyEnv === 'sandbox' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Sandbox (Test)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold uppercase cursor-pointer"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
