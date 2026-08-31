import React, { useState, useRef } from "react";
import { Save, Lock, Camera, Upload } from "lucide-react";
import { toast } from "sonner";

export interface ProfileState {
  fullName: string;
  role: string;
  email: string;
  loginPin: string;
  avatar: string;
}

const initialProfile: ProfileState = {
  fullName: "Olivia Rhye",
  role: "Store Manager",
  email: "manager@rene-pos.com",
  loginPin: "1234",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
};

interface AccountDetailsProps {
  initialData?: ProfileState;
  onSave?: (profile: ProfileState) => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  initialData = initialProfile,
  onSave,
}) => {
  const [profile, setProfile] = useState<ProfileState>(initialData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
        toast.success("Profile photo uploaded successfully!");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);

    // Reset input so re-selecting the same file also triggers onChange
    e.target.value = "";
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.fullName.trim()) {
      toast.error("Please enter full name");
      return;
    }

    if (onSave) {
      onSave(profile);
    }
    toast.success("Account profile updated successfully!");
  };

  return (
    <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300 animate-in fade-in duration-300">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      <form onSubmit={handleUpdateProfile} className="space-y-8">
        {/* Header / Profile Info */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Account Details
          </h2>
          <div className="w-full h-px bg-[#1F2E4D]" />

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            {/* Clickable Profile Avatar with hover overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              title="Click to update profile photo"
            >
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#1F2E4D] group-hover:border-orange-500 transition-all shadow-md"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-5 h-5 text-white" />
              </div>
              {/* Badge Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-0 right-0 p-1.5 bg-[#052350] hover:bg-orange-500 border-2 border-[#131b2e] text-white rounded-full transition-colors shadow-sm cursor-pointer"
                title="Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {profile.fullName || "Manager Profile"}
                </h3>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#052350] text-blue-300 border border-[#1F2E4D]">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Manage your personal account details & profile avatar.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium pt-1 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload new photo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Inputs Grid (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Full Name (Editable) */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              placeholder="Olivia Rhye"
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#052350] focus:ring-1 focus:ring-[#052350] transition-all shadow-inner"
            />
          </div>

          {/* Role (Non-clickable / Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1.5">
                Role
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Read-only</span>
            </div>
            <input
              type="text"
              value={profile.role}
              readOnly
              disabled
              tabIndex={-1}
              placeholder="Store Manager"
              className="w-full px-5 py-3 rounded-full bg-[#0b1220]/60 border border-[#1F2E4D]/60 text-sm text-slate-400 placeholder:text-slate-600 cursor-not-allowed select-none pointer-events-none shadow-inner opacity-75 focus:outline-none"
            />
          </div>

          {/* Professional Email (Non-clickable / Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1.5">
                Professional Email
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Read-only</span>
            </div>
            <input
              type="email"
              value={profile.email}
              readOnly
              disabled
              tabIndex={-1}
              placeholder="manager@rene-pos.com"
              className="w-full px-5 py-3 rounded-full bg-[#0b1220]/60 border border-[#1F2E4D]/60 text-sm text-slate-400 placeholder:text-slate-600 cursor-not-allowed select-none pointer-events-none shadow-inner opacity-75 focus:outline-none"
            />
          </div>

          {/* Login Pin (Non-clickable / Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1.5">
                Login Pin
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Read-only</span>
            </div>
            <input
              type="password"
              value={profile.loginPin}
              readOnly
              disabled
              tabIndex={-1}
              placeholder="••••"
              className="w-full px-5 py-3 rounded-full bg-[#0b1220]/60 border border-[#1F2E4D]/60 text-sm text-slate-400 placeholder:text-slate-600 cursor-not-allowed select-none pointer-events-none shadow-inner opacity-75 focus:outline-none font-mono tracking-widest"
            />
          </div>
        </div>

        {/* Bottom Right Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-[#1F2E4D] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Update identity</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
