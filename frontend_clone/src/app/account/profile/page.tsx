"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "user@example.com",
    phone: "+91 9876543210",
    address: "123 Science Market, Ambala Cantt, Haryana 133001",
  });


  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-theme">My Profile</h1>
          <p className="text-slate-400">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass-dark border border-theme/10 rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="relative mb-6 group cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-electric-blue/20 text-electric-blue flex items-center justify-center border-4 border-electric-blue/30">
              <User size={64} />
            </div>
            <div className="absolute inset-0 bg-theme/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <Camera className="text-theme" size={24} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-theme">{formData.name}</h2>
          <p className="text-slate-400 text-sm mb-6">{formData.email}</p>
          <div className="w-full bg-theme/40 rounded-xl p-4 text-left border border-theme/5 space-y-3">
             <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone size={16} className="text-neon-cyan" /> {formData.phone}
             </div>
             <div className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin size={16} className="text-neon-cyan mt-1" /> 
                <span className="leading-tight">{formData.address}</span>
             </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 glass border border-theme/10 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-theme">Account Details</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-electric-blue hover:text-neon-cyan text-sm font-medium transition-colors"
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-theme/40 border border-theme/10 rounded-xl pl-12 pr-4 py-3 text-theme outline-none focus:border-neon-cyan disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="email" 
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-theme/40 border border-theme/10 rounded-xl pl-12 pr-4 py-3 text-theme outline-none focus:border-neon-cyan disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="tel" 
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-theme/40 border border-theme/10 rounded-xl pl-12 pr-4 py-3 text-theme outline-none focus:border-neon-cyan disabled:opacity-50 transition-colors"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-500" size={18} />
                  <textarea 
                    rows={3}
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-theme/40 border border-theme/10 rounded-xl pl-12 pr-4 py-3 text-theme outline-none focus:border-neon-cyan disabled:opacity-50 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <button type="submit" className="bg-electric-blue hover:bg-blue-600 text-theme font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors ml-auto shadow-lg box-glow">
                <Save size={18} /> Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
