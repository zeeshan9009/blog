import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Shield, 
  Plus, 
  Trash2, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  KeyRound,
  Sparkles
} from 'lucide-react';
import { Branch, TeamMember, UserRole } from '../types/models';

export const TeamManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'branches' | 'permissions'>('members');
  
  // Data state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  
  // Member invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Production Manager');
  const [inviteBranch, setInviteBranch] = useState('');

  // Branch create modal
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchCity, setBranchCity] = useState('');
  const [branchType, setBranchType] = useState<Branch['type']>('Factory / Plant');

  useEffect(() => {
    const defaultBranches: Branch[] = [
      {
        id: 'br-1',
        name: 'Haier Master Manufacturing Plant',
        code: 'PK-LHR-PLANT-01',
        city: 'Lahore (Industrial Zone)',
        country: 'Pakistan',
        type: 'Factory / Plant',
        activeItemsCount: 428190
      },
      {
        id: 'br-2',
        name: 'Southern Regional Logistics & Hub',
        code: 'PK-KHI-HUB-02',
        city: 'Karachi (Port Qasim)',
        country: 'Pakistan',
        type: 'Distribution Center',
        activeItemsCount: 194120
      },
      {
        id: 'br-3',
        name: 'Geneva Haute Vault & Atelier',
        code: 'CH-GVA-VAULT-01',
        city: 'Geneva',
        country: 'Switzerland',
        type: 'Regional HQ',
        activeItemsCount: 1420
      }
    ];
    setBranches(defaultBranches);

    const defaultMembers: TeamMember[] = [
      {
        id: 'mem-1',
        name: 'Zeeshan Tariq',
        email: 'zeeshan.tariq@haier.com.pk',
        role: 'Owner',
        branchId: 'br-1',
        branchName: 'Haier Master Manufacturing Plant',
        status: 'active',
        lastActive: 'Online now'
      },
      {
        id: 'mem-2',
        name: 'Engr. Haris Mehmood',
        email: 'haris.m@haier.com.pk',
        role: 'Production Manager',
        branchId: 'br-1',
        branchName: 'Haier Master Manufacturing Plant',
        status: 'active',
        lastActive: '14m ago'
      },
      {
        id: 'mem-3',
        name: 'Sophia Al-Mansoor',
        email: 'sophia.m@veripass.id',
        role: 'Certificate Officer',
        branchId: 'br-3',
        branchName: 'Geneva Haute Vault & Atelier',
        status: 'active',
        lastActive: '1h ago'
      },
      {
        id: 'mem-4',
        name: 'Capt. Asad Ullah',
        email: 'asad.u@security.veripass.id',
        role: 'Security Auditor',
        branchId: 'br-2',
        branchName: 'Southern Regional Logistics & Hub',
        status: 'active',
        lastActive: '3h ago'
      }
    ];
    setMembers(defaultMembers);
  }, []);

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const selectedB = branches.find((b) => b.id === inviteBranch) || branches[0];
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      branchId: selectedB.id,
      branchName: selectedB.name,
      status: 'invited',
      lastActive: 'Invitation Pending'
    };

    setMembers([...members, newMember]);
    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || !branchCity.trim()) return;

    const newBr: Branch = {
      id: `br-${Date.now()}`,
      name: branchName.trim(),
      code: `PK-${branchCity.toUpperCase().slice(0, 3)}-0${branches.length + 1}`,
      city: branchCity.trim(),
      country: 'Pakistan',
      type: branchType,
      activeItemsCount: 0
    };

    setBranches([...branches, newBr]);
    setBranchName('');
    setBranchCity('');
    setShowBranchModal(false);
  };

  const rolePermissionsMatrix = [
    { permission: 'Mint Single & Bulk Passports', owner: true, admin: true, prodMgr: true, certOfficer: false, auditor: false, viewer: false },
    { permission: 'Export Raw QR Matrices & Vector SVGs', owner: true, admin: true, prodMgr: true, certOfficer: false, auditor: false, viewer: false },
    { permission: 'Issue Cryptographic Certificates', owner: true, admin: true, prodMgr: false, certOfficer: true, auditor: false, viewer: false },
    { permission: 'Approve / Reject Warranty Claims', owner: true, admin: true, prodMgr: true, certOfficer: false, auditor: false, viewer: false },
    { permission: 'Trigger Product Safety Recalls', owner: true, admin: true, prodMgr: false, certOfficer: false, auditor: true, viewer: false },
    { permission: 'Manage API Keys & Webhooks', owner: true, admin: true, prodMgr: false, certOfficer: false, auditor: false, viewer: false },
    { permission: 'Inspect Audit Logs & Geo Radar', owner: true, admin: true, prodMgr: true, certOfficer: true, auditor: true, viewer: true },
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[#155EEF]" />
              Organization, Branches & Team Roles (RBAC)
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#155EEF] font-mono text-[10px] font-bold uppercase">
              Multi-Branch Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your company hierarchy, assign regional manufacturing plants, and configure role-based access permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['members', 'branches', 'permissions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                activeTab === tab 
                  ? 'bg-[#155EEF] text-white border-[#155EEF]' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab === 'members' ? `Team (${members.length})` : tab === 'branches' ? `Branches (${branches.length})` : 'Role Matrix'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB: TEAM MEMBERS */}
      {activeTab === 'members' && (
        <div className="bg-white border border-slate-200 shadow-xs space-y-5 p-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-base">Authorized Personnel</h3>
              <p className="text-xs text-slate-500 mt-0.5">Enterprise members with cryptographic ledger privileges.</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Team Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Branch</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{m.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 font-mono font-bold uppercase text-[10px] ${
                        m.role === 'Owner' 
                          ? 'bg-purple-100 text-purple-800' 
                          : m.role === 'Admin' 
                          ? 'bg-blue-100 text-blue-800' 
                          : m.role === 'Production Manager' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {m.branchName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 font-bold uppercase text-[10px] ${
                        m.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{m.lastActive}</td>
                    <td className="py-3 px-4 text-right">
                      {m.role !== 'Owner' && (
                        <button
                          onClick={() => setMembers(members.filter((x) => x.id !== m.id))}
                          className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. TAB: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="bg-white border border-slate-200 shadow-xs space-y-5 p-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-base">Manufacturing Plants & Regional Hubs</h3>
              <p className="text-xs text-slate-500 mt-0.5">Physical sites issuing QR codes and serialized products.</p>
            </div>
            <button
              onClick={() => setShowBranchModal(true)}
              className="px-3.5 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Facility</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((b) => (
              <div key={b.id} className="bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold">
                    {b.type}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">{b.code}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                <div className="text-xs text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{b.city}, {b.country}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Minted Units:</span>
                  <span className="font-mono font-bold text-[#155EEF]">{b.activeItemsCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: ROLE MATRIX */}
      {activeTab === 'permissions' && (
        <div className="bg-white border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="font-black text-slate-900 text-base">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Granular capability breakdown per enterprise tier user.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">System Capability</th>
                  <th className="py-3 px-3 text-center">Owner</th>
                  <th className="py-3 px-3 text-center">Admin</th>
                  <th className="py-3 px-3 text-center">Prod Mgr</th>
                  <th className="py-3 px-3 text-center">Cert Officer</th>
                  <th className="py-3 px-3 text-center">Auditor</th>
                  <th className="py-3 px-3 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rolePermissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{row.permission}</td>
                    <td className="py-3 px-3 text-center">{row.owner ? '✓' : '—'}</td>
                    <td className="py-3 px-3 text-center">{row.admin ? '✓' : '—'}</td>
                    <td className="py-3 px-3 text-center">{row.prodMgr ? '✓' : '—'}</td>
                    <td className="py-3 px-3 text-center">{row.certOfficer ? '✓' : '—'}</td>
                    <td className="py-3 px-3 text-center">{row.auditor ? '✓' : '—'}</td>
                    <td className="py-3 px-3 text-center">{row.viewer ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MODAL: INVITE MEMBER */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-300 max-w-md w-full p-6 text-left space-y-4 shadow-2xl rounded-none">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#155EEF]" />
                Invite Team Member
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleInviteMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asim Munir"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="user@enterprise.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Enterprise Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 font-mono focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Production Manager">Production Manager</option>
                    <option value="Certificate Officer">Certificate Officer</option>
                    <option value="Security Auditor">Security Auditor</option>
                    <option value="Support Viewer">Support Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Facility</label>
                  <select
                    value={inviteBranch}
                    onChange={(e) => setInviteBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="px-3 py-2 bg-slate-100 text-slate-700 font-bold uppercase cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold uppercase cursor-pointer">Send Invitation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: ADD BRANCH */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-300 max-w-md w-full p-6 text-left space-y-4 shadow-2xl rounded-none">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#155EEF]" />
                Add Enterprise Facility
              </h3>
              <button onClick={() => setShowBranchModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddBranch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Islamabad Assembly Plant 2"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-[#155EEF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad"
                    value={branchCity}
                    onChange={(e) => setBranchCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none focus:border-[#155EEF]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Facility Type</label>
                  <select
                    value={branchType}
                    onChange={(e) => setBranchType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 text-slate-900 focus:outline-none"
                  >
                    <option value="Factory / Plant">Factory / Plant</option>
                    <option value="Distribution Center">Distribution Center</option>
                    <option value="Retail Flagship">Retail Flagship</option>
                    <option value="Regional HQ">Regional HQ</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowBranchModal(false)} className="px-3 py-2 bg-slate-100 text-slate-700 font-bold uppercase cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#155EEF] hover:bg-blue-700 text-white font-bold uppercase cursor-pointer">Save Facility</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
