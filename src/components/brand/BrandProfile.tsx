import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchUserProfile } from "../../store/thunks/userThunks";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Camera, Edit2, Lock, User, Mail, Building2, Instagram, Pencil, Crown } from "lucide-react";

// Fallback profile data for brands
const initialProfile = {
  brandName: "Brand Name",
  email: "brand@example.com",
  description: "Brand description not available",
  phone: "Not specified",
  website: "Not specified",
  address: "Not specified",
  avatar: "",
  companyName: "Company Name",
  instagram: "@company",
};

export default function BrandProfile() {
  const dispatch = useAppDispatch();
  
  // Get profile data from Redux store
  const { profile, isLoading, error } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  
  const [editField, setEditField] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState(initialProfile);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  
  // Add a ref for the file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    if (user && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, profile]);

  // Merge user data with profile data and fallback to defaults
  const displayProfile = {
    brandName: profile?.name || user?.name || initialProfile.brandName,
    email: profile?.email || user?.email || initialProfile.email,
    description: profile?.bio || initialProfile.description,
    phone: initialProfile.phone, // TODO: Add to profile schema
    website: profile?.website || initialProfile.website,
    address: profile?.location || initialProfile.address,
    avatar: profile?.avatar || initialProfile.avatar,
    companyName: initialProfile.companyName, // TODO: Add to profile schema
    instagram: initialProfile.instagram, // TODO: Add to profile schema
  };

  // Update fieldValues when profile data changes
  useEffect(() => {
    setFieldValues(displayProfile);
  }, [profile, user]);

  // Handlers for editing fields
  const handleEdit = (field: string) => {
    setEditField(field);
    setFieldValues(displayProfile);
  };
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    // setProfile(fieldValues); // This line was removed as per the new_code
    setEditField(null);
  };
  const handleCancel = () => {
    setEditField(null);
    setFieldValues(displayProfile);
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
        // setProfile((prev) => ({ ...prev, avatar: event.target?.result as string })); // This line was removed as per the new_code
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#171717] py-10 px-2 md:px-0 flex flex-col items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#171717] py-10 px-2 md:px-0 flex flex-col items-center justify-center">
        <div className="text-red-500">Error loading profile: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#171717] py-10 px-2 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-full px-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Meu Perfil</h1>
        <p className="text-muted-foreground mb-8">Gerencie seu perfil e informações da marca</p>
        <Card className="p-6 md:p-10">
          <CardContent className="p-0">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-background shadow-lg">
                  <AvatarImage src={displayProfile.avatar} alt="Profile" />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                {/* Premium Icon */}
                {user?.isPremium && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
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
                  <span className="text-xl md:text-2xl font-bold">{displayProfile.brandName}</span>
                  {user?.isPremium && (
                    <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                <span className="text-muted-foreground text-sm md:text-base">
                  {displayProfile.description}
                </span>
              </div>
            </div>
            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Brand Name */}
              <div>
                <Label htmlFor="brandName" className="mb-1 block">Nome completo</Label>
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
                      value={displayProfile.brandName}
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
                <Label htmlFor="email" className="mb-1 block">E-mail</Label>
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
                      value={displayProfile.email}
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
                <Label htmlFor="companyName" className="mb-1 block">Nome da empresa</Label>
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
                      value={displayProfile.companyName}
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
                      value={displayProfile.instagram}
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
              <Label htmlFor="description" className="mb-1 block">Descrição da marca</Label>
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
                    value={displayProfile.description}
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
                <Button variant="secondary" onClick={handleSave}>Salvar</Button>
                <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
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
                    <Lock className="w-4 h-4" />
                    Alterar a senha
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar a senha</DialogTitle>
                    <DialogDescription>Atualize a senha da sua conta abaixo.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="old">Senha atual</Label>
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
                      <Label htmlFor="new">Nova Senha</Label>
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
                      <Label htmlFor="confirm">Confirmar nova senha</Label>
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
                      <Button type="submit" variant="secondary">Atualizar senha</Button>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancelar</Button>
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

