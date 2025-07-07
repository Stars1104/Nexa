import { useState, useRef } from "react";
import { Camera, Instagram, Youtube, User, Globe, Music2, Plus } from "lucide-react";
import { Button } from "../ui/button";

const MAX_BIO_LENGTH = 300;
const MAX_FILES_PER_UPLOAD = 5;
const MAX_TOTAL_FILES = 12;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "video/mp4", "video/quicktime"];

function getFileType(file) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "other";
}

export default function Portfolio() {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [bio, setBio] = useState("");
    const [socials, setSocials] = useState({
        instagram: "",
        tiktok: "",
        youtube: "",
        other: "",
    });
    const [media, setMedia] = useState([]); // { file, url, type }
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaInputRef = useRef<HTMLInputElement>(null);

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setProfilePic(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSocialChange = (key: string, value: string) => {
        setSocials((prev) => ({ ...prev, [key]: value }));
    };

    // --- Media Upload Logic ---
    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        addMediaFiles(files);
        e.target.value = ""; // reset input
    };

    const addMediaFiles = (files: File[]) => {
        let validFiles = files.filter(
            (file) => ACCEPTED_TYPES.includes(file.type)
        );
        if (validFiles.length + media.length > MAX_TOTAL_FILES) {
            validFiles = validFiles.slice(0, MAX_TOTAL_FILES - media.length);
        }
        validFiles = validFiles.slice(0, MAX_FILES_PER_UPLOAD);
        const newMedia = validFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
            type: getFileType(file),
        }));
        setMedia((prev) => [...prev, ...newMedia]);
    };

    const handleRemoveMedia = (idx: number) => {
        setMedia((prev) => {
            URL.revokeObjectURL(prev[idx].url);
            return prev.filter((_, i) => i !== idx);
        });
    };

    // Drag and drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        const files = Array.from(e.dataTransfer.files || []);
        addMediaFiles(files);
    };

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full mx-auto min-h-screen dark:bg-[#171717]">
            {/* Info Banner */}
            <div className="rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-4 py-3 text-sm flex items-center gap-2 border border-purple-200 dark:border-purple-800">
                <span className="font-semibold">Dica:</span>
                <span>Um portfólio bem completo aumenta suas chances de ser aprovado! <span role="img" aria-label="rocket">🚀</span></span>
            </div>

            {/* Profile Photo */}
            <section className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
                <h2 className="font-semibold text-base sm:text-lg mb-2">Foto de Perfil</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-28 h-28 flex-shrink-0">
                        <div className="w-28 h-28 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center bg-muted overflow-hidden">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="object-cover w-full h-full rounded-full" />
                            ) : (
                                <Camera className="w-10 h-10 text-muted-foreground" />
                            )}
                        </div>
                        <button
                            className="absolute bottom-0 right-0 bg-[#E91E63] hover:bg-pink-600 text-white rounded-full p-2 shadow-md border-2 border-white dark:border-[#171717]"
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Adicionar foto"
                            type="button"
                        >
                            <span className="sr-only">Adicionar foto</span>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeWidth="2" d="M12 8v8m4-4H8" /></svg>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={handleProfilePicChange}
                        />
                    </div>
                    <div className="flex-1 text-xs text-muted-foreground space-y-1">
                        <div><span className="font-semibold">Formatos suportados:</span> JPG / PNG</div>
                        <div><span className="font-semibold">Tamanho recomendado:</span> Imagem quadrada (será exibida em formato circular)</div>
                    </div>
                </div>
            </section>

            {/* Personal Info */}
            <section className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col gap-5 shadow-sm">
                <h2 className="font-semibold text-base sm:text-lg mb-2">Perfil</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="profileTitle">Perfil Título</label>
                        <input
                            id="profileTitle"
                            type="text"
                            className="w-full rounded-md border px-3 py-2 text-base bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder:text-muted-foreground"
                            placeholder="Editor de vídeo sênior"
                        />
                        <div className="text-xs text-muted-foreground mt-1">Nome da sua conta, não pode ser alterado aqui.</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="miniBio">Mini Bio <span className="text-xs text-muted-foreground">(máx. 300 caracteres)</span></label>
                        <textarea
                            id="miniBio"
                            className="w-full rounded-md border px-3 py-2 text-base bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder:text-muted-foreground resize-none min-h-[80px]"
                            maxLength={MAX_BIO_LENGTH}
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Criadora de conteúdo especializada em moda e lifestyle. +3 anos de experiência com marcas no Instagram e TikTok."
                        />
                        <div className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/{MAX_BIO_LENGTH} caracteres</div>
                    </div>
                </div>
            </section>

            {/* Media Gallery */}
            <section className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col gap-5 shadow-sm">
                <h2 className="font-semibold text-base sm:text-lg mb-1">Galeria de Mídia</h2>
                <p className="text-sm text-muted-foreground mb-4">Adicione fotos e vídeos que mostram seu estilo de criação</p>
                {/* Dropzone */}
                <div
                    className={`border-2 border-dashed border-muted-foreground/40 rounded-lg bg-background flex flex-col items-center justify-center py-8 px-2 sm:px-8 mb-4 transition ${dragActive ? 'ring-2 ring-pink-400' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center gap-2">
                        <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                        <div className="font-semibold text-base text-foreground">Arraste arquivos para cá</div>
                        <div className="text-xs text-muted-foreground mb-2">Formatos aceitos: JPG, PNG, MP4, MOV</div>
                        <Button
                            className="bg-[#E91E63] hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-md mt-2"
                            onClick={() => mediaInputRef.current?.click()}
                            disabled={media.length >= MAX_TOTAL_FILES}
                        >Adicionar Mídia</Button>
                        <input
                            ref={mediaInputRef}
                            type="file"
                            accept="image/png, image/jpeg,video/mp4,video/quicktime"
                            className="hidden"
                            multiple
                            onChange={handleMediaChange}
                            disabled={media.length >= MAX_TOTAL_FILES}
                        />
                        <div className="text-xs text-muted-foreground mt-2">Máximo: 5 arquivos por vez, 12 itens no total</div>
                    </div>
                </div>
                {/* Media Grid */}
                <div>
                    <h3 className="font-semibold text-base mb-2">Meu Trabalho</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {media.map((item, idx) => (
                            <div key={idx} className="rounded-lg bg-background border border-mute flex flex-col items-start justify-between aspect-[4/3] p-2 relative overflow-hidden group">
                                <span className={`absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full ${item.type === 'image' ? 'bg-purple-500' : 'bg-blue-500'}`}>{item.type === 'image' ? 'Foto' : 'Vídeo'}</span>
                                {item.type === 'image' ? (
                                    <img src={item.url} alt="media" className="object-cover w-full h-full rounded-md" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                        <VideoIcon />
                                    </div>
                                )}
                                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    {/* Remove button */}
                                    <button
                                        className="bg-white dark:bg-[#232323] border border-muted-foreground/20 rounded-full p-1 shadow hover:bg-muted transition"
                                        onClick={() => handleRemoveMedia(idx)}
                                        aria-label="Remover mídia"
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Add new media button if not at max */}
                        {media.length < MAX_TOTAL_FILES && (
                            <button
                                className="rounded-lg border-2 border-dashed border-muted-foreground/40 bg-background flex items-center justify-center aspect-[4/3] text-3xl text-muted-foreground hover:bg-muted/70 transition"
                                onClick={() => mediaInputRef.current?.click()}
                                type="button"
                                aria-label="Adicionar mídia"
                            >
                                <Plus className="w-8 h-8" />
                            </button>
                        )}
                    </div>
                    {/* Tips */}
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 text-xs">
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Inclua pelo menos 3 trabalhos para se destacar!</div>
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Mostre variedade – vídeos curtos, fotos, reviews...</div>
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
                <Button className="bg-[#E91E63] hover:bg-pink-600 text-white font-semibold px-8 py-2 rounded-md text-base">Salvar Portfólio</Button>
            </div>
        </div>
    );
}

function VideoIcon() {
    return (
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-blue-500"><rect x="3" y="5" width="15" height="14" rx="2" fill="currentColor" opacity="0.1"/><rect x="3" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M21 7v10l-4-3.5V10.5L21 7z" fill="currentColor"/></svg>
    );
}
