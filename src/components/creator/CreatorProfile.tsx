import React, { useState } from "react";
import EditProfile from "./EditProfile";

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

const defaultProfile = {
    name: "Andrii Kerrn",
    email: "andriikerrn@gmail.com",
    state: "United States",
    role: "Influencer",
    languages: ["English", "Spanish"],
    gender: "Male",
    categories: ["Fashion", "Lifestyle", "Beauty"],
    image: null,
};

export const CreatorProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({ ...defaultProfile });

    if (editMode) {
        return (
            <EditProfile
                initialProfile={profile}
                onCancel={() => setEditMode(false)}
                onSave={(updated) => {
                    setProfile(updated);
                    setEditMode(false);
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#171717] p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">My Account</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your personal information</p>
                <div className="bg-background rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="font-semibold text-base text-gray-900 dark:text-white">Profile information</span>
                        <button
                            className="flex items-center gap-1 text-pink-500 hover:text-pink-600 text-sm font-medium focus:outline-none"
                            onClick={() => setEditMode(true)}
                        >
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 012-2z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                    <div className="flex flex-col gap-8 items-start">
                        {/* Avatar and name */}
                        <div className="flex gap-4 items-center min-w-[120px]">
                            <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-400 flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-white mb-2">
                                {getInitials(profile.name)}
                            </div>
                            <div>
                                <div className="text-base font-semibold text-gray-900 dark:text-white">{profile.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-300">{profile.email}</div>
                            </div>
                        </div>
                        {/* Info grid */}
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm mt-2">
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">State</div>
                                <div className="text-gray-900 dark:text-white">{profile.state}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">Role</div>
                                <div className="text-gray-900 dark:text-white">{profile.role}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">Spoken languages</div>
                                <div className="text-gray-900 dark:text-white">{profile.languages.join(", ")}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 dark:text-gray-400">Gender</div>
                                <div className="text-gray-900 dark:text-white">{profile.gender}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatorProfile;
