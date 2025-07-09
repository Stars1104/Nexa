import { useState, useRef } from "react";
import { Camera, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "../ui/dialog";

const MAX_BIO_LENGTH = 500;
const MAX_FILES_PER_UPLOAD = 5;
const MAX_TOTAL_FILES = 12;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "video/mp4", "video/quicktime"];

// Function to get user initials from name
const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
};

function getFileType(file) {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "other";
}

export default function Portfolio() {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [bio, setBio] = useState("🎬 3D Video Editor | Visual Storyteller | Motion Design Enthusiast\n\nI'm a creative and detail-driven 3D Video Editor with a passion for turning concepts into stunning visual experiences. With a strong foundation in 3D modeling, animation, and cinematic editing, I specialize in creating immersive content for films, commercials, games, and digital platforms.");
    const [profileTitle, setProfileTitle] = useState("🎬 3D Video Editor | Visual Storyteller | Motion Design Enthusiast");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPortfolioEditDialogOpen, setIsPortfolioEditDialogOpen] = useState(false);
    const [media, setMedia] = useState([]); // { file, url, type }
    const [dragActive, setDragActive] = useState(false);
    const mediaInputRef = useRef<HTMLInputElement>(null);

    // Mock user data - in real app this would come from user state/context
    const userName = "Jhon Doe";

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

    const handleSaveProfile = () => {
        // Here you would typically save the profile data to your backend
        console.log("Saving profile:", { profileTitle, bio });
        setIsEditDialogOpen(false);
    };

    const handleSavePortfolio = () => {
        // Here you would typically save the portfolio data to your backend
        console.log("Saving portfolio:", { media });
        setIsPortfolioEditDialogOpen(false);
    };

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full mx-auto min-h-screen dark:bg-[#171717]">
            {/* Info Banner */}
            <div className="rounded-md bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-4 py-3 text-sm flex items-center gap-2 border border-purple-200 dark:border-purple-800">
                <span className="font-semibold">Dica:</span>
                <span>Um portfólio bem completo aumenta suas chances de ser aprovado! <span role="img" aria-label="rocket">🚀</span></span>
            </div>

            {/* Profile Section */}
            <section className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
                <h2 className="font-semibold text-base sm:text-lg mb-2">Perfil</h2>
                <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-28 h-28 flex-shrink-0">
                            <div className="w-28 h-28 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center bg-muted overflow-hidden">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="object-cover w-full h-full rounded-full" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-purple-100 dark:bg-[#E91E63] flex items-center justify-center text-2xl font-bold text-purple-600 dark:text-white">
                                        {getInitials(userName)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 text-xs text-muted-foreground space-y-1">
                            <div>
                                <span className="font-semibold text-3xl">{userName}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-2xl">{profileTitle}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                        <div className="text-lg text-muted-foreground whitespace-pre-wrap">
                            {bio}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-6">
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                                <button className="bg-[#E91E63] hover:bg-pink-600 text-white font-semibold px-8 py-2 rounded-md text-base">Editar Perfil</button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Editar Perfil</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4 py-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="profileTitle">Perfil Título</label>
                                        <input
                                            id="profileTitle"
                                            type="text"
                                            className="w-full rounded-md border px-3 py-2 text-base bg-background text-foreground outline-none transition placeholder:text-muted-foreground"
                                            placeholder="Editor de vídeo sênior"
                                            value={profileTitle}
                                            onChange={(e) => setProfileTitle(e.target.value)}
                                        />
                                        <div className="text-xs text-muted-foreground mt-1">Nome da sua conta, não pode ser alterado aqui.</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="miniBio">Mini Bio <span className="text-xs text-muted-foreground">(máx. 500 caracteres)</span></label>
                                        <textarea
                                            id="miniBio"
                                            className="w-full rounded-md border px-3 py-2 text-base bg-background text-foreground outline-none transition placeholder:text-muted-foreground resize-none min-h-[150px]"
                                            maxLength={MAX_BIO_LENGTH}
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                            placeholder="Criadora de conteúdo especializada em moda e lifestyle. +3 anos de experiência com marcas no Instagram e TikTok."
                                        />
                                        <div className="text-xs text-muted-foreground mt-1 text-right">{bio.length}/{MAX_BIO_LENGTH} caracteres</div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditDialogOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="bg-[#E91E63] hover:bg-pink-600 text-white"
                                        onClick={handleSaveProfile}
                                    >
                                        Salvar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="rounded-xl border bg-card p-4 sm:p-6 flex flex-col gap-5 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                    <h2 className="font-semibold text-base sm:text-lg">Portfólio</h2>
                    <Dialog open={isPortfolioEditDialogOpen} onOpenChange={setIsPortfolioEditDialogOpen}>
                        <DialogTrigger asChild>
                            <button className="bg-[#E91E63] hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-md text-sm">Add Portfólio</button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Editar Portfólio</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div>
                                    <h3 className="font-semibold text-base mb-2">Adicionar Mídia</h3>
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
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base mb-2">Meu Trabalho ({media.length}/{MAX_TOTAL_FILES})</h3>
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
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition"
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
                            </div>
                            <DialogFooter>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsPortfolioEditDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    className="bg-[#E91E63] hover:bg-pink-600 text-white"
                                    onClick={handleSavePortfolio}
                                >
                                    Salvar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                {/* Media Grid */}
                <div>
                    <h3 className="font-semibold text-base mb-2">Meu Trabalho ({media.length}/{MAX_TOTAL_FILES})</h3>
                    {media.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Nenhum trabalho adicionado ainda</p>
                            <p className="text-sm">Clique em "Editar Portfólio" para adicionar seus trabalhos</p>
                        </div>
                    ) : (
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
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition"
                                            onClick={() => handleRemoveMedia(idx)}
                                            aria-label="Remover mídia"
                                        >
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto text-blue-500"><rect x="3" y="5" width="15" height="14" rx="2" fill="currentColor" opacity="0.1" /><rect x="3" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M21 7v10l-4-3.5V10.5L21 7z" fill="currentColor" /></svg>
    );
}
