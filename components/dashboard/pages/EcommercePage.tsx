
import React, { useState } from 'react';
import { Product } from '../../../types';
import Button from '../common/Button';

export default function EcommercePage({ companyId }: { companyId: string }) {
    const [products] = useState<Product[]>([
        { id: '1', name: 'Industrial Valve X1', sku: 'VAL-X1', price: 299.99, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200', description: 'High-pressure stainless steel valve for industrial liquid management.', isPublished: true },
        { id: '2', name: 'Flow Meter Delta', sku: 'FLW-D', price: 850.00, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=200', description: 'Digital flow meter with real-time IoT monitoring support.', isPublished: true },
        { id: '3', name: 'Sensor Hub G2', sku: 'SNS-G2', price: 125.50, stock: 0, imageUrl: 'https://images.unsplash.com/photo-1591405351990-4726e33df58d?auto=format&fit=crop&q=80&w=200', description: 'Multi-channel sensor hub for shop floor telemetry.', isPublished: false },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">E-commerce Catalog</h2>
                    <p className="text-sm text-slate-400">Manage your online products and storefront presence.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon="fa-eye">Live Storefront</Button>
                    <Button icon="fa-plus">Add Product</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                    <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden group hover:border-purple-500 transition-all">
                        <div className="h-48 relative overflow-hidden">
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {!p.isPublished && (
                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                    <span className="bg-slate-800 text-slate-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-slate-600">Draft</span>
                                </div>
                            )}
                            <div className="absolute bottom-2 right-2">
                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${p.stock > 0 ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                                    {p.stock > 0 ? `${p.stock} In Stock` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-bold truncate pr-4">{p.name}</h4>
                                <p className="text-cyan-400 font-black">${p.price.toFixed(2)}</p>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{p.description}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                                <span className="text-[10px] text-slate-500 font-mono">{p.sku}</span>
                                <div className="flex gap-2">
                                    <button className="text-slate-400 hover:text-white p-1"><i className="fas fa-edit"></i></button>
                                    <button className="text-slate-400 hover:text-red-400 p-1"><i className="fas fa-trash-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
