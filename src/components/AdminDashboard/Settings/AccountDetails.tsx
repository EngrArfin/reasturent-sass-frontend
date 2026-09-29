import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  Lock,
  Camera,
  Upload,
  Loader2,
  Building,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/auth/authApi";

export interface ProfileState {
  fullName: string;
  role: string;
  email: string;
  loginPin: string;
  avatar: string;
  businessName?: string;
}

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

// Client-side image compression helper to avoid PayloadTooLargeError
const compressImage = (
  file: File,
  maxWidth = 200,
  maxHeight = 200,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as compact JPEG data URL (~10-25KB)
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const AccountDetails: React.FC = () => {
  const { data: profileData, isLoading, isFetching } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profileData) {
      setFullName(profileData.name || "");
      setAvatar(profileData.avatar || "");
    }
  }, [profileData]);

  const handleAvatarFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setIsCompressing(true);
      // Auto-compress high-res images to ultra-lightweight payload
      const compressedDataUrl = await compressImage(file, 200, 200, 0.7);
      setAvatar(compressedDataUrl);
      toast.success("Photo optimized & loaded! Click 'Update identity' to save.");
    } catch (err) {
      console.error("Image compression error:", err);
      toast.error("Failed to process image file");
    } finally {
      setIsCompressing(false);
      e.target.value = "";
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter full name");
      return;
    }

    try {
      await updateProfile({
        name: fullName.trim(),
        avatar: avatar || null,
      }).unwrap();
      toast.success("Account profile updated successfully!");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.error || "Failed to update profile"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#131b2e] rounded-3xl p-16 border border-[#1F2E4D] shadow-sm flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-medium text-slate-300">
          Loading profile details...
        </p>
      </div>
    );
  }

  const role = profileData?.role || "Staff / User";
  const email = profileData?.email || "";
  const loginPin = profileData?.pin || "••••";
  const businessName =
    profileData?.business?.businessName ||
    profileData?.business?.name ||
    "Restaurant Branch";

  return (
    <div className="w-full bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-[#1F2E4D] shadow-sm text-slate-300 animate-in fade-in duration-300">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileSelect}
        accept="image/*"
        className="hidden"
      />

      <form onSubmit={handleUpdateProfile} className="space-y-8">
        {/* Header / Profile Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Account Details
            </h2>
            {isFetching && !isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-blue-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing...</span>
              </div>
            )}
          </div>
          <div className="w-full h-px bg-[#1F2E4D]" />

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            {/* Clickable Profile Avatar with hover overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer shrink-0"
              title="Click to upload profile photo"
            >
              <img
                src={avatar || defaultAvatar}
                alt={fullName || "Profile"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#1F2E4D] group-hover:border-blue-500 transition-all shadow-md bg-[#0b1220]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultAvatar;
                }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {isCompressing ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </div>
              {/* Badge Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-0 right-0 p-1.5 bg-[#052350] hover:bg-blue-600 border-2 border-[#131b2e] text-white rounded-full transition-colors shadow-sm cursor-pointer"
                title="Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                  {fullName || profileData?.name || "User Profile"}
                </h3>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#052350] text-blue-300 border border-blue-500/30 uppercase">
                  {role}
                </span>
                {profileData?.business && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-[#0b1220] text-slate-300 border border-[#1F2E4D]">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{businessName}</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Manage your personal account identity & profile photo.
              </p>

              <div className="flex items-center gap-4 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
                >
                  {isCompressing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{isCompressing ? "Optimizing..." : "Upload photo"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium cursor-pointer transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{showUrlInput ? "Hide image URL" : "Set image URL"}</span>
                </button>
              </div>

              {showUrlInput && (
                <div className="pt-2 max-w-md">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 rounded-xl bg-[#0b1220] border border-[#1F2E4D] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              )}
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Olivia Rhye"
              className="w-full px-5 py-3 rounded-full bg-[#0b1220] border border-[#1F2E4D] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1.5">
                Role
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Read-only
              </span>
            </div>
            <input
              type="text"
              value={role}
              readOnly
              disabled
              tabIndex={-1}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220]/60 border border-[#1F2E4D]/60 text-sm text-slate-400 cursor-not-allowed select-none pointer-events-none shadow-inner opacity-75 focus:outline-none uppercase"
            />
          </div>

          {/* Professional Email (Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1.5">
                Professional Email
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Read-only
              </span>
            </div>
            <input
              type="email"
              value={email}
              readOnly
              disabled
              tabIndex={-1}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220]/60 border border-[#1F2E4D]/60 text-sm text-slate-400 cursor-not-allowed select-none pointer-events-none shadow-inner opacity-75 focus:outline-none"
            />
          </div>

          {/* Login Pin (Read-only) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-1.5">
                Login Pin
                <Lock className="w-3 h-3 text-slate-500" />
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                Read-only
              </span>
            </div>
            <input
              type="password"
              value={loginPin}
              readOnly
              disabled
              tabIndex={-1}
              className="w-full px-5 py-3 rounded-full bg-[#0b1220]/60 border border-[#1F2E4D]/60 text-sm text-slate-400 cursor-not-allowed select-none pointer-events-none shadow-inner opacity-75 focus:outline-none font-mono tracking-widest"
            />
          </div>
        </div>

        {/* Bottom Right Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdating || isCompressing}
            className="w-full sm:w-auto px-7 py-3 bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isUpdating ? "Saving..." : "Update identity"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
