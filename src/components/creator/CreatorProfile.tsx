import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchUserProfile, updateUserProfile } from "../../store/thunks/userThunks";
import { updateUserPassword } from "../../store/thunks/authThunks";
import { Crown, Key } from "lucide-react";
import { toast } from "sonner";
import EditProfile from "./EditProfile";
import UpdatePasswordModal from "../ui/UpdatePasswordModal";

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

// Fallback profile data if no user data is available
const defaultProfile = {
    name: "User",
    email: "user@example.com",
    state: "Not specified",
    role: "Influencer",
    languages: ["English"],
    gender: "Not specified",
    categories: ["General"],
    image: null,
};

export const CreatorProfile = () => {
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    
    // Get profile data from Redux store
    const { profile, isLoading, error } = useAppSelector((state) => state.user);
    const { user } = useAppSelector((state) => state.auth);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                await dispatch(fetchUserProfile()).unwrap();
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error("Erro ao carregar perfil");
            }
        };
        
        fetchProfile();
    }, [dispatch]);

    // Merge user data with profile data and fallback to defaults
    const displayProfile = {
        name: profile?.name || user?.name || defaultProfile.name,
        email: profile?.email || user?.email || defaultProfile.email,
        state: profile?.location || defaultProfile.state,
        role: profile?.role || user?.role || defaultProfile.role,
        languages: profile?.languages || defaultProfile.languages,
        gender: profile?.gender || defaultProfile.gender,
        categories: profile?.categories || defaultProfile.categories,
        image: profile?.avatar || null,
        has_premium: profile?.has_premium || false,
    };

    const handleSaveProfile = async (updatedProfile: any) => {
        try {
            // Map form data to API format
            const profileData = {
                name: updatedProfile.name,
                email: updatedProfile.email,
                location: updatedProfile.state, // Map state to location
                role: updatedProfile.role,
                languages: Array.isArray(updatedProfile.languages) 
                    ? updatedProfile.languages 
                    : updatedProfile.languages?.split(',').map((l: string) => l.trim()),
                gender: updatedProfile.gender,
                categories: updatedProfile.categories,
                image: updatedProfile.image, // File object if uploaded
            };

            await dispatch(updateUserProfile(profileData)).unwrap();
            toast.success("Profile updated successfully!");
            setEditMode(false);
        } catch (error: any) {
            toast.error(error || "Failed to update profile");
        }
    };

    const handleUpdatePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
        if (!user?.id) {
            toast.error("User not authenticated");
            return;
        }

        setIsPasswordLoading(true);
        try {
            const passwordUpdateData = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                userId: user.id
            };
            await dispatch(updateUserPassword(passwordUpdateData)).unwrap();
            toast.success("Password updated successfully!");
            setShowPasswordModal(false);
        } catch (error: any) {
            toast.error(error || "Failed to update password");
        } finally {
            setIsPasswordLoading(false);
        }
    };

    if (editMode) {
        return (
            <EditProfile
                initialProfile={displayProfile}
                onCancel={() => setEditMode(false)}
                onSave={handleSaveProfile}
                isLoading={isLoading}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-[92vh] bg-gray-50 dark:bg-[#171717] p-6 flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[92vh] bg-gray-50 dark:bg-[#171717] p-6 flex items-center justify-center">
                <div className="text-red-500">Error loading profile: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-[92vh] bg-gray-50 dark:bg-[#171717] p-6">
            <div className="w-full">
                <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Minha Conta</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Gerencie suas informações pessoais</p>
                <div className="bg-background rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="font-semibold text-base text-gray-900 dark:text-white">Informações do perfil</span>
                        <div className="flex items-center gap-3">
                            <button
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm font-medium focus:outline-none"
                                onClick={() => setShowPasswordModal(true)}
                            >
                                <Key className="w-4 h-4" />
                                Change Password
                            </button>
                            <button
                                className="flex items-center gap-1 text-pink-500 hover:text-pink-600 text-sm font-medium focus:outline-none"
                                onClick={() => setEditMode(true)}
                            >
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 012-2z" />
                                </svg>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-8 items-start">
                        {/* Avatar and name */}
                        <div className="flex gap-4 items-center min-w-[120px]">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-400 flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-white mb-2">
                                    {displayProfile.image ? (
                                        <img 
                                            src={displayProfile.image} 
                                            alt="Profile" 
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                    ) : (
                                        getInitials(displayProfile.name)
                                    )}
                                </div>
                                {/* Premium Icon */}
                                {displayProfile.has_premium && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                                        <Crown className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-semibold text-gray-900 dark:text-white">{displayProfile.name}</span>
                                    {user?.isPremium && (
                                        <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full">
                                            PRO
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-300">{displayProfile.email}</div>
                            </div>
                        </div>
                        {/* Info grid */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm mt-2">
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">Estado</div>
                                <div className="text-gray-900 dark:text-white">{displayProfile.state}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">Role</div>
                                <div className="text-gray-900 dark:text-white">{displayProfile.role}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">Línguas faladas</div>
                                <div className="text-gray-900 dark:text-white">{displayProfile.languages.join(", ")}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">Gênero</div>
                                <div className="text-gray-900 dark:text-white">{displayProfile.gender}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Password Modal */}
            <UpdatePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSubmit={handleUpdatePassword}
                isLoading={isPasswordLoading}
            />
        </div>
    );
};

export default CreatorProfile;
