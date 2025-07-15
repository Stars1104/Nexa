import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserProfile } from "../../store/thunks/userThunks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "../ui/sonner";
import { Camera, Edit, Save, X } from "lucide-react";

// Initial profile data
const initialProfile = {
  brandName: "",
  email: "",
  description: "",
  phone: "",
  website: "",
  address: "",
  avatar: "",
  companyName: "",
  instagram: "",
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
    <div className="min-h-screen bg-white dark:bg-[#171717] py-10 px-2 md:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Perfil da Marca
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gerencie as informações da sua marca
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Foto do Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={displayProfile.avatar} alt="Profile" />
                  <AvatarFallback className="text-2xl">
                    {displayProfile.brandName?.charAt(0)?.toUpperCase() || "M"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 text-center">
                Clique no ícone da câmera para alterar a foto
              </p>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Informações da Marca</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Brand Name */}
              <div className="space-y-2">
                <Label htmlFor="brandName">Nome da Marca</Label>
                <div className="flex items-center space-x-2">
                  {editField === "brandName" ? (
                    <>
                      <Input
                        id="brandName"
                        name="brandName"
                        value={fieldValues.brandName}
                        onChange={handleFieldChange}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        value={displayProfile.brandName}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("brandName")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center space-x-2">
                  {editField === "email" ? (
                    <>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={fieldValues.email}
                        onChange={handleFieldChange}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        value={displayProfile.email}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("email")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <div className="flex items-start space-x-2">
                  {editField === "description" ? (
                    <>
                      <Textarea
                        id="description"
                        name="description"
                        value={fieldValues.description}
                        onChange={handleFieldChange}
                        rows={3}
                        className="flex-1"
                      />
                      <div className="flex flex-col space-y-1">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Textarea
                        value={displayProfile.description}
                        readOnly
                        rows={3}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("description")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex items-center space-x-2">
                  {editField === "website" ? (
                    <>
                      <Input
                        id="website"
                        name="website"
                        value={fieldValues.website}
                        onChange={handleFieldChange}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        value={displayProfile.website}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("website")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <div className="flex items-center space-x-2">
                  {editField === "address" ? (
                    <>
                      <Input
                        id="address"
                        name="address"
                        value={fieldValues.address}
                        onChange={handleFieldChange}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        value={displayProfile.address}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit("address")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Senha</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">Senha Atual</Label>
                <Input
                  id="oldPassword"
                  name="old"
                  type="password"
                  value={passwords.old}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  name="new"
                  type="password"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirm"
                  type="password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

