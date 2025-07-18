import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBrandProfile, updateBrandProfile, changePassword } from "../../store/slices/brandProfileSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "../ui/sonner";
import { Camera, Edit, Key, DollarSign } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Brazilian states array
const BRAZILIAN_STATES = [
  "Acre",
  "Alagoas",
  "Amapá",
  "Amazonas",
  "Bahia",
  "Ceará",
  "Distrito Federal",
  "Espírito Santo",
  "Goiás",
  "Maranhão",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Pará",
  "Paraíba",
  "Paraná",
  "Pernambuco",
  "Piauí",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondônia",
  "Roraima",
  "Santa Catarina",
  "São Paulo",
  "Sergipe",
  "Tocantins"
];

// Initial profile data
const initialProfile = {
  username: "",
  email: "",
  companyName: "",
  whatsappNumber: "",
  gender: "",
  state: "",
  avatar: "",
};

export default function BrandProfile() {
  const dispatch = useAppDispatch();
  
  // Get profile data from Redux store
  const { profile, isLoading, error, isUpdating, isChangingPassword } = useAppSelector((state) => state.brandProfile);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [fieldValues, setFieldValues] = useState(initialProfile);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  
  // Add a ref for the file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(fetchBrandProfile()).unwrap();
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error("Erro ao carregar perfil");
      }
    };
    
    fetchProfile();
  }, [dispatch]);

  // Merge profile data and fallback to defaults
  const displayProfile = {
    username: profile?.name || initialProfile.username,
    email: profile?.email || initialProfile.email,
    companyName: profile?.company_name || initialProfile.companyName,
    whatsappNumber: profile?.whatsapp_number || initialProfile.whatsappNumber,
    gender: profile?.gender || initialProfile.gender,
    state: profile?.state || initialProfile.state,
    avatar: profile?.avatar || initialProfile.avatar,
  };

  // Update fieldValues when profile data changes
  useEffect(() => {
    setFieldValues(displayProfile);
  }, [profile]);

  // Handlers for editing fields
  const handleEditModalOpen = () => {
    setFieldValues(displayProfile);
    setShowEditModal(true);
  };
  
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFieldValues({ ...fieldValues, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFieldValues({ ...fieldValues, [field]: value });
  };
  
  const handleSave = async () => {
    try {
      const updateData = {
        username: fieldValues.username,
        email: fieldValues.email,
        company_name: fieldValues.companyName,
        whatsapp_number: fieldValues.whatsappNumber,
        gender: fieldValues.gender as 'male' | 'female' | 'other',
        state: fieldValues.state,
        avatar: fieldValues.avatar,
      };

      await dispatch(updateBrandProfile(updateData)).unwrap();
      setShowEditModal(false);
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erro ao atualizar perfil");
    }
  };
  
  const handleCancel = () => {
    setShowEditModal(false);
    setFieldValues(displayProfile);
  };

  // Password change handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      const passwordData = {
        old_password: passwords.old,
        new_password: passwords.new,
        new_password_confirmation: passwords.confirm,
      };

      await dispatch(changePassword(passwordData)).unwrap();
      setShowPasswordDialog(false);
      setPasswords({ old: "", new: "", confirm: "" });
      toast.success("Senha alterada com sucesso");
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Erro ao alterar senha");
    }
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
        // Update the fieldValues with the new avatar
        setFieldValues(prev => ({
          ...prev,
          avatar: event.target?.result as string
        }));
        toast.success("Foto de perfil selecionada");
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[92vh] dark:bg-[#171717] py-10 w-full md:px-0 flex flex-col items-center justify-center">
        <div className="text-gray-400">Carregando perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[92vh] dark:bg-[#171717] py-10 w-full md:px-0 flex flex-col items-center justify-center">
        <div className="text-red-500">Erro ao carregar perfil: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[92vh] dark:bg-[#171717] py-10 w-full md:px-0">
      <div className="w-full px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Informações do Perfil
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowPasswordDialog(true)}
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-400 transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>Alterar Senha</span>
            </button>
            <button
              onClick={handleEditModalOpen}
              className="flex items-center space-x-2 text-pink-500 hover:text-pink-400 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar Perfil</span>
            </button>
          </div>
        </div>

        {/* Profile Identity Section */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={fieldValues.avatar || displayProfile.avatar} alt="Profile" />
              <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-400 to-purple-600">
                {displayProfile.username?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-white">
              {displayProfile.username}
            </h2>
            <p className="text-gray-300">
              {displayProfile.email}
            </p>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            DETALHES PESSOAIS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* State */}
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">ESTADO</div>
                <div className="text-white font-medium">
                  {displayProfile.state || "Não informado"}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">IDIOMAS FALADOS</div>
                <div className="text-white font-medium">en</div>
              </div>

              {/* WhatsApp Number */}
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">NÚMERO DO WHATSAPP</div>
                <div className="text-white font-medium">
                  {displayProfile.whatsappNumber || "Não informado"}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Role */}
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">FUNÇÃO</div>
                <div className="text-white font-medium">creator</div>
              </div>

              {/* Gender */}
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">GÊNERO</div>
                <div className="text-white font-medium">
                  {displayProfile.gender || "Não informado"}
                </div>
              </div>

              {/* Company Name */}
              <div className="bg-background rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">NOME DA EMPRESA</div>
                <div className="text-white font-medium">
                  {displayProfile.companyName || "Não informado"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />

        {/* Edit Profile Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="bg-background border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Editar Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={fieldValues.avatar || profile?.avatar} alt="Profile" />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-400 to-purple-600">
                      {fieldValues.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Clique no ícone da câmera para alterar a foto
                </p>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Nome de Usuário</Label>
                <Input
                  id="username"
                  name="username"
                  value={fieldValues.username}
                  onChange={handleFieldChange}
                  className="bg-background text-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={fieldValues.email}
                  onChange={handleFieldChange}
                  className="bg-background text-white"
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-gray-300">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={fieldValues.companyName}
                  onChange={handleFieldChange}
                  className="bg-background text-white"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber" className="text-gray-300">Número do WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={fieldValues.whatsappNumber}
                  onChange={handleFieldChange}
                  className="bg-background text-white"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-300">Gênero</Label>
                <Select
                  value={fieldValues.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger className="bg-background text-white border-gray-600">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-gray-600">
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-gray-300">Estado</Label>
                <Select
                  value={fieldValues.state}
                  onValueChange={(value) => handleSelectChange("state", value)}
                >
                  <SelectTrigger className="bg-background text-white border-gray-600">
                    <SelectValue placeholder="Selecione um estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-gray-600 max-h-60">
                    {BRAZILIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="text-gray-300 hover:bg-background"
                  disabled={isUpdating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#e91e63] text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="bg-background border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Alterar Senha</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword" className="text-gray-300">Senha Atual</Label>
                <Input
                  id="oldPassword"
                  name="old"
                  type="password"
                  value={passwords.old}
                  onChange={handlePasswordChange}
                  required
                  className="bg-background text-white"
                />
              </div>
              <div>
                <Label htmlFor="newPassword" className="text-gray-300">Nova Senha</Label>
                <Input
                  id="newPassword"
                  name="new"
                  type="password"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  required
                  className="bg-background text-white"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirm"
                  type="password"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  required
                  className="bg-background text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordDialog(false)}
                  className="text-gray-300 hover:bg-background"
                  disabled={isChangingPassword}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#e91e63] text-white"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Alterando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

