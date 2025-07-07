import { Clock, DollarSign, File } from "lucide-react";
import React, { useState } from "react";
import ApplyModal from "./ApplyModal";

// Mock data for demonstration
const mockProject = {
    id: "1",
    title: "Look de Verão",
    brand: "ModaX",
    about: "ModaX é uma marca jovem de roupas casuais com foco em sustentabilidade.",
    objective: "Aumentar visibilidade da nova coleção de verão entre público jovem.",
    requirements: [
        "Mostrar pelo menos 2 peças da coleção",
        "Mencionar a sustentabilidade",
        "Tag #ModaXVerao",
    ],
    rights: "Uso em redes sociais da marca por 3 meses",
    notes: "Preferência por gravação em ambiente externo com luz natural.",
    payment: "R$500",
    deadline: "10/07/2025",
    contentType: "Vídeo : TikTok (15 seg)",
    exampleImage: "/src/assets/landing/post.png",
};

interface ProjectDetailProps {
    setComponent?: (component: string) => void;
    projectId?: number;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ setComponent, projectId  }) => {
    const project = mockProject;
    const [open, setOpen] = useState(false);
    const handleConfirm = () => {
    };
    return (
        <div className="dark:bg-[#171717] min-h-full">
            <div className="w-full mx-auto py-8 px-2 md:px-8">
                {/* Back button */}
                <div className="mb-4">
                    <button
                        className="flex items-center text-muted-foreground text-sm font-normal hover:underline mb-2"
                        onClick={() => setComponent("Painel")}
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        Voltar para campanhas
                    </button>
                </div>
                <div className="w-full mx-auto bg-background dark:bg-background rounded-2xl border border-border shadow-sm p-6 md:p-10 flex flex-col md:flex-row gap-10">
                    {/* Left: Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-end mb-2">
                            <span className="text-xs text-primary bg-primary/10 dark:bg-primary/20 rounded px-3 py-1 font-medium">{project.contentType}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-foreground">{project.title}</h1>
                        <div className="text-muted-foreground text-base mb-8">{project.brand}</div>

                        <div className="mb-7">
                            <h2 className="font-bold text-[17px] mb-1 text-foreground">Sobre a marca</h2>
                            <p className="text-muted-foreground text-[15px]">{project.about}</p>
                        </div>

                        <div className="mb-7">
                            <h2 className="font-bold text-[17px] mb-1 text-foreground">Objetivo da campanha</h2>
                            <p className="text-muted-foreground text-[15px]">{project.objective}</p>
                        </div>

                        <div className="mb-7">
                            <h2 className="font-bold text-[17px] mb-1 text-foreground">Requisitos obrigatórios</h2>
                            <ul className="list-disc pl-5 text-muted-foreground text-[15px] space-y-1">
                                {project.requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-7">
                            <h2 className="font-bold text-[17px] mb-1 text-foreground">Direitos de uso</h2>
                            <p className="text-muted-foreground text-[15px]">{project.rights}</p>
                        </div>

                        <div className="mb-2">
                            <h2 className="font-bold text-[17px] mb-1 text-foreground">Observações importantes</h2>
                            <p className="text-muted-foreground text-[15px]">{project.notes}</p>
                        </div>
                    </div>

                    {/* Right: Info card, image, button */}
                    <div className="w-full md:w-[340px] flex flex-col gap-6 flex-shrink-0">
                        <div className="bg-muted dark:bg-[#232326] rounded-xl p-5 flex flex-col gap-4 border border-border">
                            <div className="flex items-center gap-3">
                                <DollarSign className="text-[#E91E63]" />
                                <div>
                                    <div className="text-xs text-muted-foreground">Pagamento</div>
                                    <div className="font-bold text-base text-foreground">{project.payment}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="text-[#E91E63]" />
                                <div>
                                    <div className="text-xs text-muted-foreground">Prazo final</div>
                                    <div className="font-bold text-base text-foreground">{project.deadline}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <File className="text-[#E91E63]" />
                                <div>
                                    <div className="text-xs text-muted-foreground">Tipo de conteúdo</div>
                                    <div className="font-bold text-base text-foreground">{project.contentType}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-[15px] font-bold mb-2 text-foreground">Exemplo visual</div>
                            <img
                                src={project.exampleImage}
                                alt="Exemplo visual"
                                className="rounded-xl w-full h-52 object-cover rounded-xl border border-border"
                            />
                        </div>
                        <button className="mt-2 bg-[#E91E63] hover:bg-[#E91E63]/80 text-white font-bold rounded-xl py-4 text-base transition w-full" onClick={() => setOpen(true)}>
                            Aplicar para esta campanha
                        </button>
                    </div>
                </div>
            </div>
            <ApplyModal
                open={open}
                onOpenChange={setOpen}
                campaignName={project.title}
                brandName={project.brand}
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default ProjectDetail;
