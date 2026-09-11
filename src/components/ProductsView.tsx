import React, { useState } from 'react';
import { Product } from '../types/product';
import {
  Box,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileText,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Layers
} from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onPreviewPassport: (product: Product) => void;
  onOpenQrCodes: () => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onOpenAddProduct,
  onPreviewPassport,
  onOpenQrCodes,
  onDeleteProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
            <span>CRYPTOGRAPHIC INVENTORY CATALOG</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Registered Products & Digital Passports
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            View, manage, and verify all serialized items protected by the VeriPass anti-counterfeit protocol.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenQrCodes}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#155EEF]" />
            <span>View All QR Codes</span>
          </button>

          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-3.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, serial or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#155EEF] text-xs pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <span className="text-[11px] font-mono text-slate-400">
            Total: <strong className="text-slate-900">{filteredProducts.length}</strong>
          </span>
        </div>
      </div>

      {/* Products Table / Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center text-[#155EEF] mb-3">
            <Box className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No products registered</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Start by registering your luxury goods or electronic items to issue instant cryptographic certificates.
          </p>
          <button
            onClick={onOpenAddProduct}
            className="mt-4 px-4 py-2 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register First Product</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-3 font-semibold">Passport ID</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Serial / Batch</th>
                <th className="py-3 px-3 font-semibold">Origin</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Product Title */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{product.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{product.brand}</div>
                  </td>

                  {/* Passport ID */}
                  <td className="py-3 px-3 font-mono text-[11px] font-semibold text-[#155EEF]">
                    {product.id}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {product.category}
                  </td>

                  {/* Serial & Batch */}
                  <td className="py-3 px-3 font-mono text-[10.5px] text-slate-500">
                    <div>{product.serialNumber}</div>
                    <div className="text-[9.5px] text-slate-400">{product.batchNumber}</div>
                  </td>

                  {/* Origin */}
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {product.originCountry}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          window.location.hash = `#p/${product.id}`;
                        }}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10.5px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Open Customer Public Scan View"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-600" />
                        <span>Public View</span>
                      </button>

                      <button
                        onClick={() => onPreviewPassport(product)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-[#155EEF] border border-slate-200 text-slate-700 text-[10.5px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Digital Passport Modal"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Passport</span>
                      </button>

                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
