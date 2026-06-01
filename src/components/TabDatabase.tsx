import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, Search, Database, ArrowRight, Table, Terminal, ShieldAlert, Check } from 'lucide-react';
import { DatabaseRow, WorkspaceData } from '../types';

const INITIAL_USERS: DatabaseRow[] = [
  { id: 1, email: 'colleon@gmail.com', name: 'John', profile_picture_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40', role: 'User', created_at: '2023-01-08 14:22' },
  { id: 2, email: 'coskak@gmail.com', name: 'Mark', profile_picture_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=40&h=40', role: 'Developer', created_at: '2023-09-05 10:15' },
  { id: 3, email: 'hhane@gmail.com', name: 'Jarem', profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40', role: 'Product', created_at: '2023-09-19 11:45' },
  { id: 4, email: 'biassenn@gmail.com', name: 'Daveh', profile_picture_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=40&h=40', role: 'Manager', created_at: '2023-09-29 09:12' },
  { id: 5, email: 'contoon@gmail.com', name: 'Davik', profile_picture_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=40&h=40', role: 'Developer', created_at: '2023-03-20 16:30' },
  { id: 6, email: 'shatom@gmail.com', name: 'Vahan', profile_picture_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=40&h=40', role: 'User', created_at: '2022-09-19 13:02' }
];

const MOCK_PRODUCTS = [
  { id: '1', title: 'Premium Yoga Mat', sku: 'YOGA-MAT-001', price: '$49.99', category: 'Gear' },
  { id: '2', title: 'Carbon Dumbbells set', sku: 'DB-SET-050', price: '$129.99', category: 'Strength' },
  { id: '3', title: 'Bluetooth Sleep Band', sku: 'BAND-SL-02', price: '$89.00', category: 'Electronics' },
  { id: '4', title: 'Insulated Water Flask', sku: 'FLASK-32OZ', price: '$34.50', category: 'Accessories' }
];

const MOCK_ORDERS = [
  { id: 'O-1004', user_id: '1', date: '2023-11-01', total: '$49.99', status: 'Fulfilled' },
  { id: 'O-1005', user_id: '5', date: '2023-11-03', total: '$129.99', status: 'Shipped' },
  { id: 'O-1006', user_id: '3', date: '2023-11-04', total: '$218.99', status: 'Pending' }
];

interface TabDatabaseProps {
  activeApp?: WorkspaceData | null;
}

export default function TabDatabase({ activeApp }: TabDatabaseProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<'users' | 'products' | 'orders'>('users');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [extraColumns, setExtraColumns] = React.useState<string[]>([]);
  
  const [users, setUsers] = React.useState<DatabaseRow[]>(INITIAL_USERS);
  const [products, setProducts] = React.useState(MOCK_PRODUCTS);
  const [orders, setOrders] = React.useState(MOCK_ORDERS);
  const [editingRowId, setEditingRowId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<DatabaseRow>>({});

  const [sqlPrompt, setSqlPrompt] = React.useState('');
  const [schemaSuccess, setSchemaSuccess] = React.useState('');

  React.useEffect(() => {
    if (activeApp) {
      if (activeApp.sampleUsers && activeApp.sampleUsers.length > 0) {
        setUsers(activeApp.sampleUsers);
      }
      if (activeApp.sampleProducts && activeApp.sampleProducts.length > 0) {
        setProducts(activeApp.sampleProducts);
      }
      if (activeApp.sampleOrders && activeApp.sampleOrders.length > 0) {
        setOrders(activeApp.sampleOrders);
      }
    }
  }, [activeApp]);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) =>
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNewRow = () => {
    if (activeSubTab === 'products') {
      const nextId = String(products.length + 1);
      const newProd = {
        id: nextId,
        title: 'New Fitness Gear',
        sku: `FIT-GEAR-${Date.now().toString().slice(-3)}`,
        price: '$59.99',
        category: 'Accessories'
      };
      setProducts([...products, newProd]);
      setSchemaSuccess(`✅ Added new product row: [ID: ${nextId}]`);
      setTimeout(() => setSchemaSuccess(''), 4000);
      return;
    }
    if (activeSubTab === 'orders') {
      const nextId = `O-${1000 + orders.length + 5}`;
      const newOrder = {
        id: nextId,
        user_id: '3',
        date: new Date().toISOString().slice(0, 10),
        total: '$89.00',
        status: 'Pending'
      };
      setOrders([...orders, newOrder]);
      setSchemaSuccess(`✅ Appended new order transaction: [ID: ${nextId}]`);
      setTimeout(() => setSchemaSuccess(''), 4000);
      return;
    }
    const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newRow: DatabaseRow = {
      id: nextId,
      name: 'New Associate',
      email: 'newuser@domain.com',
      profile_picture_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&h=40',
      role: 'User',
      created_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    setUsers([...users, newRow]);
    setEditingRowId(nextId);
    setEditForm(newRow);
  };

  const handleDeleteRow = (id: number) => {
    setUsers(users.filter((item) => item.id !== id));
    if (editingRowId === id) {
      setEditingRowId(null);
    }
  };

  const startEditRow = (row: DatabaseRow) => {
    setEditingRowId(row.id);
    setEditForm({ ...row });
  };

  const saveInlineEdit = () => {
    if (editingRowId === null) return;
    setUsers(users.map((u) => (u.id === editingRowId ? { ...u, ...editForm } as DatabaseRow : u)));
    setEditingRowId(null);
  };

  const handleSqlPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sqlPrompt.trim()) return;

    const lower = sqlPrompt.toLowerCase();
    const originalPrompt = sqlPrompt;
    setSqlPrompt('');

    if (lower.includes('user') || lower.includes('admin') || lower.includes('dev') || lower.includes('manager') || lower.includes('employee') || lower.includes('member')) {
      const emailMatch = originalPrompt.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const email = emailMatch ? emailMatch[0] : `${originalPrompt.replace(/[^a-zA-Z]/g, '').slice(0, 7).toLowerCase() || 'member'}${Math.floor(Math.random() * 900) + 100}@gmail.com`;
      
      let name = "Custom Member";
      const nameMatch = originalPrompt.match(/(?:named|user|name|member)\s+([a-zA-Z0-9]+)/i);
      if (nameMatch && nameMatch[1]) {
        name = nameMatch[1];
      } else {
        const words = originalPrompt.split(/\s+/);
        const addIndex = words.findIndex(w => ['add', 'create', 'insert', 'new'].includes(w.toLowerCase()));
        if (addIndex !== -1 && words[addIndex + 1] && !['user', 'member', 'admin', 'developer', 'dev'].includes(words[addIndex+1].toLowerCase())) {
          name = words[addIndex + 1];
        } else {
          name = words[0];
        }
      }
      name = name.charAt(0).toUpperCase() + name.slice(1);

      let role: 'User' | 'Admin' | 'Developer' | 'Product' | 'Manager' = 'User';
      if (lower.includes('admin')) role = 'Admin';
      else if (lower.includes('developer') || lower.includes('dev')) role = 'Developer';
      else if (lower.includes('manager')) role = 'Manager';
      else if (lower.includes('product')) role = 'Product';

      const nextId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newRow: DatabaseRow = {
        id: nextId,
        name,
        email,
        profile_picture_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40`,
        role,
        created_at: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };

      setUsers(prev => [...prev, newRow]);
      setActiveSubTab('users');
      setSchemaSuccess(`🚀 DataStored: Appended member "${name}" (${role}) with credentials <${email}> inside database table.`);
    } 
    else if (lower.includes('product') || lower.includes('item') || lower.includes('gear') || lower.includes('bottle') || lower.includes('mat') || lower.includes('dumb')) {
      let title = "Custom Fit Tool";
      const titleMatch = originalPrompt.match(/(?:product|named|item|gear)\s+([a-zA-Z0-9\s]+?)(?:\s+for|\s+price|\s+with|\s+under|$)/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }

      let price = "$39.99";
      const priceMatch = originalPrompt.match(/\$?\d+(?:\.\d{2})?/);
      if (priceMatch) {
        price = priceMatch[0].startsWith('$') ? priceMatch[0] : `$${priceMatch[0]}`;
      }

      let category = "Gear";
      if (lower.includes('strength') || lower.includes('weight') || lower.includes('dumb')) category = "Strength";
      else if (lower.includes('elect') || lower.includes('smart') || lower.includes('band')) category = "Electronics";
      else if (lower.includes('access') || lower.includes('flask') || lower.includes('water')) category = "Accessories";

      const nextId = String(products.length + 1);
      const newProd = {
        id: nextId,
        title,
        sku: `FIT-${category.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 90) + 10}`,
        price,
        category
      };

      setProducts(prev => [...prev, newProd]);
      setActiveSubTab('products');
      setSchemaSuccess(`🚀 DataStored: Ingested fitness product "${title}" (${category}) priced at ${price} into Products table.`);
    }
    else if (lower.includes('order') || lower.includes('sold') || lower.includes('buy') || lower.includes('transaction')) {
      const nextId = `O-${1000 + orders.length + 5}`;
      const randomUserId = String(Math.floor(Math.random() * users.length) + 1);
      
      let price = "$49.99";
      const priceMatch = originalPrompt.match(/\$?\d+(?:\.\d{2})?/);
      if (priceMatch) {
         price = priceMatch[0].startsWith('$') ? priceMatch[0] : `$${priceMatch[0]}`;
      }

      const newOrder = {
         id: nextId,
         user_id: randomUserId,
         date: new Date().toISOString().slice(0, 10),
         total: price,
         status: 'Pending'
      };

      setOrders(prev => [...prev, newOrder]);
      setActiveSubTab('orders');
      setSchemaSuccess(`🚀 DataStored: Invoiced custom transaction ${nextId} with total ${price} linked to customer key: ${randomUserId}`);
    }
    else if (lower.includes('phone') || lower.includes('phone_number')) {
      if (extraColumns.includes('phone_number')) {
        setSchemaSuccess("Schema altered: Field 'phone_number' is already optional inside 'Users' table.");
      } else {
        setExtraColumns([...extraColumns, 'phone_number']);
        setSchemaSuccess("Schema altered successfully: Appended 'phone_number' (VARCHAR, NULLABLE) column to Users.");
      }
    } else if (lower.includes('status') || lower.includes('state')) {
      setExtraColumns([...extraColumns, 'status']);
      setSchemaSuccess("Schema altered successfully: Appended optional 'status' (VARCHAR) column.");
    } else {
      setSchemaSuccess(`Instruction compiled: Analyzed prompt "${originalPrompt}" successfully. No direct matching schema was affected.`);
    }

    setTimeout(() => {
      setSchemaSuccess('');
    }, 5000);
  };

  const [mobileView, setMobileView] = useState<'table' | 'erd'>('table');

  return (
    <div className="flex-grow flex flex-col lg:flex-row min-h-0 overflow-hidden bg-[#070e0a]">
      
      {/* Mobile state switcher */}
      <div className="lg:hidden flex bg-black/40 border-b border-white/[0.08] p-2 gap-2 shrink-0 select-none backdrop-blur-xl">
        <button
          onClick={() => setMobileView('table')}
          className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            mobileView === 'table' 
              ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
              : 'text-zinc-450 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          Database Table
        </button>
        <button
          onClick={() => setMobileView('erd')}
          className={`flex-grow py-2.5 px-4 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer ${
            mobileView === 'erd' 
              ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]' 
              : 'text-zinc-450 hover:text-white hover:bg-white/[0.03]'
          }`}
        >
          Model (ERD)
        </button>
      </div>
      
      {/* Primary database view area */}
      <div className={`flex-grow flex flex-col bg-white/[0.01] min-h-0 overflow-hidden w-full lg:w-[calc(100%-250px)] relative z-10 ${
        mobileView === 'table' ? 'flex flex-1' : 'hidden lg:flex'
      }`}>
        
        {/* Table switching subtabs */}
        <div className="flex justify-between items-center bg-black/30 border-b border-white/[0.06] px-5 py-3 shrink-0 overflow-x-auto gap-4 scrollbar-none relative z-10 select-none">
          <div className="flex gap-1.5 items-center bg-black/40 p-1 rounded-xl shrink-0 border border-white/[0.05]">
            <button
              onClick={() => setActiveSubTab('users')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                activeSubTab === 'users' 
                  ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                  : 'text-zinc-450 hover:text-[#F5F7FF] hover:bg-white/[0.02]'
              }`}
            >
              <Database size={12} className="stroke-[2.5]" /> Users
            </button>
            <button
              onClick={() => setActiveSubTab('products')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                activeSubTab === 'products' 
                  ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                  : 'text-zinc-450 hover:text-[#F5F7FF] hover:bg-white/[0.02]'
              }`}
            >
              <Table size={12} className="stroke-[2.5]" /> Products
            </button>
            <button
              onClick={() => setActiveSubTab('orders')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                activeSubTab === 'orders' 
                  ? 'bg-[#10B981] text-zinc-950 font-black shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                  : 'text-zinc-450 hover:text-[#F5F7FF] hover:bg-white/[0.02]'
              }`}
            >
              <Table size={12} className="stroke-[2.5]" /> Orders
            </button>
          </div>

          <div className="flex gap-2 shrink-0">
            <button className="text-[10.5px] bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 px-3.5 py-2 rounded-xl border border-white/[0.06] transition-all cursor-pointer font-bold">
              + New Table
            </button>
            <button
              onClick={handleAddNewRow}
              className="text-[10.5px] bg-[#10B981] hover:bg-emerald-450 text-zinc-950 px-3.5 py-2 rounded-xl border border-transparent font-black tracking-normal transition-all duration-200 flex items-center gap-1 cursor-pointer shadow-md transform hover:scale-[1.03] active:scale-95"
            >
              <Plus size={12} className="stroke-[2.5]" /> New Row
            </button>
          </div>
        </div>

        {/* Database control search line */}
        <div className="px-5 py-3 h-14 bg-black/10 border-b border-white/[0.06] flex items-center justify-between gap-4 shrink-0 relative z-10 select-none">
          <div className="relative w-72 flex items-center">
            <Search size={13} className="absolute left-3 text-zinc-555 text-zinc-455" />
            <input
              type="text"
              placeholder={`Search in ${activeSubTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 h-8.5 outline-none text-[11.5px] text-[#F5F7FF] placeholder-zinc-500 focus:border-emerald-500/50 transition-all font-mono"
            />
          </div>

          <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest font-black select-none">
            Query Limit: 50 Rows
          </span>
        </div>

        {schemaSuccess && (
          <div className="mx-5 mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-450 font-sans flex items-center gap-2.5 shadow-md animate-fadeIn">
            <Check size={14} className="text-[#10B981]" />
            <span>{schemaSuccess}</span>
          </div>
        )}

        {/* Data list Table */}
        <div className="flex-grow overflow-auto min-h-0 relative z-10 p-5">
          <div className="rounded-2xl border border-white/[0.06] bg-black/25 overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
            {activeSubTab === 'users' ? (
              <table className="w-full border-collapse text-left text-xs text-zinc-300 min-w-[700px]">
                <thead className="bg-[#0b120c]/90 border-b border-white/[0.06] text-zinc-450 font-black tracking-wider sticky top-0 z-10 select-none h-10 text-[10.5px] uppercase font-mono">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">id</th>
                    <th className="py-2.5 px-4">email</th>
                    <th className="py-2.5 px-4">name</th>
                    <th className="py-2.5 px-4 w-32">profile_picture_url</th>
                    <th className="py-2.5 px-4 w-32">role</th>
                    <th className="py-2.5 px-1 w-32 text-center">created_at</th>
                    {extraColumns.map((colName) => (
                      <th key={colName} className="py-2.5 px-4 text-[#10B981] font-mono">{colName}</th>
                    ))}
                    <th className="py-2.5 px-4 w-24 text-center">actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredUsers.map((user) => {
                    const isEditing = editingRowId === user.id;
                    return (
                      <tr key={user.id} className="hover:bg-white/[0.01] transition-colors leading-[1.2] group">
                        <td className="py-3 px-4 text-center font-mono font-bold text-zinc-500">{user.id}</td>
                        
                        <td className="py-2 px-4 select-text">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="bg-black/60 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs w-full outline-none text-white font-mono focus:border-[#10B981]/50 transition-all"
                            />
                          ) : (
                            <span className="font-mono text-zinc-300 select-all">{user.email}</span>
                          )}
                        </td>
                        
                        <td className="py-2 px-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="bg-black/60 border border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs w-full outline-none text-white focus:border-[#10B981]/50 transition-all font-sans"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-left">
                              <img src={user.profile_picture_url} className="w-5.5 h-5.5 rounded-full object-cover shrink-0 border border-white/10 shadow-sm" alt={user.name} referrerPolicy="no-referrer" />
                              <span className="font-bold text-[#F5F7FF] group-hover:text-emerald-400 transition-colors">{user.name}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-2 px-4 truncate max-w-[125px] text-zinc-550 font-mono text-[9px]">
                          {user.profile_picture_url}
                        </td>

                        <td className="py-2 px-4">
                          {isEditing ? (
                            <select
                              value={editForm.role || 'User'}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                              className="bg-[#0b120c] border border-emerald-500/40 rounded-lg px-1.5 py-1 text-xs w-full outline-none text-white cursor-pointer"
                            >
                              {['User', 'Admin', 'Developer', 'Product', 'Manager'].map((r) => (
                                <option key={r} value={r} className="bg-zinc-950">{r}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-normal bg-[#10B981]/15 text-[#10B981] border border-emerald-500/20 shadow-sm">
                              {user.role}
                            </span>
                          )}
                        </td>
                        
                        <td className="py-2 px-1 text-center font-mono text-zinc-500 text-[10.5px] whitespace-nowrap">{user.created_at}</td>

                        {extraColumns.map((colName) => (
                           <td key={colName} className="py-2 px-4 font-mono text-zinc-400">
                             {colName === 'phone_number' ? 'null' : 'active'}
                           </td>
                        ))}

                        <td className="py-2 px-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            {isEditing ? (
                              <button
                                onClick={saveInlineEdit}
                                className="p-1 px-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-[#10B981] hover:text-zinc-950 rounded-lg transition-all cursor-pointer border border-[#10B981]/25"
                                title="Save Changes"
                              >
                                <Save size={11} className="stroke-[2.5]" />
                              </button>
                            ) : (
                              <button
                                onClick={() => startEditRow(user)}
                                className="p-1 px-1.5 bg-white/[0.04] text-zinc-400 hover:text-emerald-400 hover:bg-[#10B981]/10 rounded-lg transition-all cursor-pointer"
                                title="Edit Inline"
                              >
                                <Edit2 size={11} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteRow(user.id)}
                              className="p-1 px-1.5 bg-white/[0.02] text-zinc-550 hover:text-red-400 hover:bg-red-500/15 rounded-lg transition-all cursor-pointer font-bold"
                              title="Delete Row"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : activeSubTab === 'products' ? (
              <table className="w-full border-collapse text-left text-xs text-zinc-300 min-w-[500px]">
                <thead className="bg-[#0b120c]/90 border-b border-white/[0.06] text-zinc-450 font-black sticky top-0 z-10 select-none h-10 text-[10.5px] uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4 w-12 text-center">id</th>
                    <th className="py-2.5 px-4">Title</th>
                    <th className="py-2.5 px-4">SKU Code</th>
                    <th className="py-2.5 px-4">Price</th>
                    <th className="py-2.5 px-4">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-left">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-zinc-500">{prod.id}</td>
                      <td className="py-3 px-4 font-bold text-[#F5F7FF]">{prod.title}</td>
                      <td className="py-3 px-4 font-mono text-zinc-400">{prod.sku}</td>
                      <td className="py-3 px-4 text-[#10B981] font-mono font-black">{prod.price}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-lg text-[9.5px] font-bold bg-[#EF4444]/10 text-orange-400 border border-[#EF4444]/15">
                          {prod.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full border-collapse text-left text-xs text-zinc-300 min-w-[500px]">
                <thead className="bg-[#0b120c]/90 border-b border-white/[0.06] text-zinc-450 font-black sticky top-0 z-10 select-none h-10 text-[10.5px] uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Order ID</th>
                    <th className="py-2.5 px-4">User ID (FK)</th>
                    <th className="py-2.5 px-4 font-mono">Date</th>
                    <th className="py-2.5 px-4">Total Price</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/[0.01] transition-colors text-left">
                      <td className="py-3 px-4 font-mono text-[#F5F7FF] font-bold">{ord.id}</td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{ord.user_id}</td>
                      <td className="py-3 px-4 text-[#9CA3AF] font-mono">{ord.date}</td>
                      <td className="py-3 px-4 text-zinc-200 font-extrabold">{ord.total}</td>
                      <td className="py-3 px-4 text-left">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[9.5px] font-black border uppercase tracking-wider ${
                          ord.status === 'Fulfilled' 
                            ? 'bg-[#10B981]/15 text-[#10B981] border-emerald-500/20' 
                            : ord.status === 'Shipped' 
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/15' 
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/15'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Console Command */}
        <div className="p-4 bg-black/40 border-t border-white/[0.06] flex gap-3 shrink-0 items-center backdrop-blur-md">
          <form onSubmit={handleSqlPromptSubmit} className="relative flex-grow flex items-center rounded-xl border border-white/10 bg-[#061208]/95 focus-within:border-[#10B981]/50 transition-all duration-300 px-3.5 py-1.5 shadow-inner focus-within:shadow-[0_0_15px_rgba(16,185,129,0.15)] w-full">
            <span className="text-[8px] text-[#10B981] font-black uppercase tracking-widest mr-3 select-none font-mono bg-emerald-500/15 px-2.5 py-1 rounded border border-emerald-500/30">SQL DDL</span>
            <input
              type="text"
              className="flex-grow bg-transparent text-xs text-white outline-none placeholder-zinc-500 font-sans h-8"
              placeholder="Inject custom database schema rule or query command manually..."
              value={sqlPrompt}
              onChange={(e) => setSqlPrompt(e.target.value)}
            />
          </form>
        </div>

      </div>

      {/* Right ERD model relationships panel */}
      <div className={`w-full lg:w-[260px] bg-[#030604] border-l border-white/[0.06] backdrop-blur-xl flex flex-col p-5 shrink-0 overflow-y-auto relative z-10 select-none ${
        mobileView === 'erd' ? 'flex flex-1' : 'hidden lg:flex'
      }`}>
        <h5 className="text-[10px] uppercase font-black tracking-widest text-[#10B981] mb-4 font-mono text-left">Model Relationships</h5>

        <div className="space-y-4 text-left">
          
          <div className="p-4 bg-white/[0.01] rounded-2xl border border-emerald-500/10 hover:border-[#10B981]/30 transition-all duration-300 relative group shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></div>
            <span className="text-[11px] font-black text-white font-mono block mb-2 tracking-normal">Users</span>
            <div className="space-y-1.5 text-[9.5px] font-mono text-zinc-500 leading-normal">
              <div className="flex justify-between"><strong className="text-zinc-400">id</strong> <span className="italic text-[#10B981]">PK / INT</span></div>
              <div className="flex justify-between"><span>email</span> <span className="text-zinc-600">VARCHAR</span></div>
              <div className="flex justify-between"><span>name</span> <span className="text-zinc-600">VARCHAR</span></div>
              <div className="flex justify-between"><span>role</span> <span className="text-zinc-600">VARCHAR</span></div>
              {extraColumns.includes('phone_number') && (
                <div className="flex justify-between text-emerald-400 font-bold"><span>phone_number</span> <span className="text-[#10B981]/50">VARCHAR</span></div>
              )}
            </div>
          </div>

          <div className="flex justify-center select-none">
            <div className="h-6 border-l border-dashed border-[#10B981]/30 animate-pulse"></div>
          </div>

          <div className="p-4 bg-white/[0.01] rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 font-sans relative group shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <span className="text-[11px] font-black text-white font-mono block mb-2 tracking-normal">Products</span>
            <div className="space-y-1.5 text-[9.5px] font-mono text-zinc-500 leading-normal">
              <div className="flex justify-between"><strong className="text-zinc-400">id</strong> <span className="italic text-emerald-400">PK / INT</span></div>
              <div className="flex justify-between"><span>title</span> <span className="text-zinc-600">VARCHAR</span></div>
              <div className="flex justify-between"><span>price</span> <span className="text-zinc-600">DECIMAL</span></div>
              <div className="flex justify-between"><span>category</span> <span className="text-zinc-600">VARCHAR</span></div>
            </div>
          </div>

          <div className="flex justify-center select-none">
            <div className="h-6 border-l border-dashed border-[#10B981]/30 animate-pulse"></div>
          </div>

          <div className="p-4 bg-white/[0.01] rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 font-sans relative group shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            <span className="text-[11px] font-black text-white font-mono block mb-2 tracking-normal">Orders</span>
            <div className="space-y-1.5 text-[9.5px] font-mono text-zinc-500 leading-normal">
              <div className="flex justify-between"><strong className="text-zinc-400">id</strong> <span className="italic text-[#10B981]">PK / STRING</span></div>
              <div className="flex justify-between"><span className="text-emerald-400 font-bold">user_id</span> <span className="italic text-zinc-600 font-bold">FK / INT</span></div>
              <div className="flex justify-between"><span>date</span> <span className="text-zinc-600">DATE</span></div>
              <div className="flex justify-between"><span>total</span> <span className="text-zinc-600">DECIMAL</span></div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
