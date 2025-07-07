import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Pencil, Camera, Mail, User, Building2, Instagram, KeyRound } from "lucide-react";

const initialProfile = {
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  brandName: "Awesome Brand",
  email: "contato@marcaincrivel.com",
  companyName: "Amazing Brand LTDA",
  instagram: "@marcaincrivel",
  description: "Sustainable fashion brand focused on timeless, quality pieces.",
};

export default function BrandProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editField, setEditField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState(profile);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  // Add a ref for the file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handlers for editing fields
  const handleEdit = (field: string) => {
    setEditField(field);
    setFieldValues(profile);
  };
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    setProfile(fieldValues);
    setEditField(null);
  };
  const handleCancel = () => {
    setEditField(null);
    setFieldValues(profile);
  };

  // Password change handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password change logic here
    setShowPasswordDialog(false);
    setPasswords({ old: "", new: "", confirm: "" });
  };

  // Handle avatar file selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({ ...prev, avatar: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#171717] py-10 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">My Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your profile and brand information</p>
        <Card className="p-6 md:p-10">
          <CardContent className="p-0">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar} alt="Profile" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                {/* Hidden file input for avatar upload */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-2 shadow-md border-4 border-background transition-colors"
                  aria-label="Change profile picture"
                  onClick={handleAvatarClick}
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-bold">{profile.brandName}</span>
                </div>
                <span className="text-muted-foreground text-sm md:text-base">
                  {profile.description}
                </span>
              </div>
            </div>
            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Brand Name */}
              <div>
                <Label htmlFor="brandName" className="mb-1 block">Brand Name</Label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-muted-foreground w-5 h-5" />
                  {editField === "brandName" ? (
                    <Input
                      name="brandName"
                      value={fieldValues.brandName}
                      onChange={handleFieldChange}
                      className="pl-10 pr-10"
                      autoFocus
                    />
                  ) : (
                    <Input
                      value={profile.brandName}
                      readOnly
                      className="pl-10 pr-10 bg-muted/40 cursor-default"
                    />
                  )}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                    onClick={() => handleEdit("brandName")}
                    aria-label="Edit brand name"
                  >
                    <Pencil className="w-4 h-4 text-pink-500" />
                  </button>
                </div>
              </div>
              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-1 block">Email</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 text-muted-foreground w-5 h-5" />
                  {editField === "email" ? (
                    <Input
                      name="email"
                      value={fieldValues.email}
                      onChange={handleFieldChange}
                      className="pl-10 pr-10"
                      autoFocus
                    />
                  ) : (
                    <Input
                      value={profile.email}
                      readOnly
                      className="pl-10 pr-10 bg-muted/40 cursor-default"
                    />
                  )}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                    onClick={() => handleEdit("email")}
                    aria-label="Edit email"
                  >
                    <Pencil className="w-4 h-4 text-pink-500" />
                  </button>
                </div>
              </div>
              {/* Company Name */}
              <div>
                <Label htmlFor="companyName" className="mb-1 block">Company Name</Label>
                <div className="relative flex items-center">
                  <Building2 className="absolute left-3 text-muted-foreground w-5 h-5" />
                  {editField === "companyName" ? (
                    <Input
                      name="companyName"
                      value={fieldValues.companyName}
                      onChange={handleFieldChange}
                      className="pl-10 pr-10"
                      autoFocus
                    />
                  ) : (
                    <Input
                      value={profile.companyName}
                      readOnly
                      className="pl-10 pr-10 bg-muted/40 cursor-default"
                    />
                  )}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                    onClick={() => handleEdit("companyName")}
                    aria-label="Edit company name"
                  >
                    <Pencil className="w-4 h-4 text-pink-500" />
                  </button>
                </div>
              </div>
              {/* Instagram */}
              <div>
                <Label htmlFor="instagram" className="mb-1 block">Instagram</Label>
                <div className="relative flex items-center">
                  <Instagram className="absolute left-3 text-muted-foreground w-5 h-5" />
                  {editField === "instagram" ? (
                    <Input
                      name="instagram"
                      value={fieldValues.instagram}
                      onChange={handleFieldChange}
                      className="pl-10 pr-10"
                      autoFocus
                    />
                  ) : (
                    <Input
                      value={profile.instagram}
                      readOnly
                      className="pl-10 pr-10 bg-muted/40 cursor-default"
                    />
                  )}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
                    onClick={() => handleEdit("instagram")}
                    aria-label="Edit instagram"
                  >
                    <Pencil className="w-4 h-4 text-pink-500" />
                  </button>
                </div>
              </div>
            </div>
            {/* Brand Description */}
            <div className="mb-6">
              <Label htmlFor="description" className="mb-1 block">Brand Description</Label>
              <div className="relative flex items-center">
                {editField === "description" ? (
                  <Textarea
                    name="description"
                    value={fieldValues.description}
                    onChange={handleFieldChange}
                    className="pr-10"
                    autoFocus
                  />
                ) : (
                  <Textarea
                    value={profile.description}
                    readOnly
                    className="pr-10 bg-muted/40 cursor-default"
                  />
                )}
                <button
                  className="absolute right-2 top-2 p-1 rounded hover:bg-accent"
                  onClick={() => handleEdit("description")}
                  aria-label="Edit description"
                >
                  <Pencil className="w-4 h-4 text-pink-500" />
                </button>
              </div>
            </div>
            {/* Edit Actions */}
            {editField && (
              <div className="flex gap-2 mb-6">
                <Button variant="secondary" onClick={handleSave}>Save</Button>
                <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              </div>
            )}
            {/* Password Change Tag/Button */}
            <div className="flex justify-end">
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-pink-500 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/30 border-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Update your account password below.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="old">Current Password</Label>
                      <Input
                        id="old"
                        name="old"
                        type="password"
                        value={passwords.old}
                        onChange={handlePasswordChange}
                        required
                        autoComplete="current-password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new">New Password</Label>
                      <Input
                        id="new"
                        name="new"
                        type="password"
                        value={passwords.new}
                        onChange={handlePasswordChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm">Confirm New Password</Label>
                      <Input
                        id="confirm"
                        name="confirm"
                        type="password"
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                        required
                        autoComplete="new-password"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" variant="secondary">Update Password</Button>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

