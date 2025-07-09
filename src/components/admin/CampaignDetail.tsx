import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import CampaignLogo from "../../assets/landing/post.png";

const statesColors = [
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
];

interface CampaignDetailProps {
  campaign: any;
  open: boolean;
  path?: string;
  onOpenChange: (open: boolean) => void;
  onApprove?: () => void;
  onReject?: () => void;
}

const CampaignDetail = ({ 
  campaign, 
  open, 
  path,
  onOpenChange, 
  onApprove, 
  onReject,
}: CampaignDetailProps) => {
  // Example extended data for demo (replace with real data as needed)
  const extended = {
    ...campaign,
    submissionDate: campaign.submissionDate || "20/11/2023",
    briefing:
      campaign.briefing ||
      "Criar conteúdo mostrando produtos de verão em uso na praia. A campanha visa destacar a linha de proteção solar da marca, enfatizando a importância da proteção contra os raios UV. Buscamos criadores que frequentam praias e piscinas e possam demonstrar o uso adequado dos produtos em situações reais.",
    requirements: [
      "Criador deve mostrar o produto sendo aplicado",
      "Mencionar os benefícios de proteção solar",
      "Incluir a hashtag #VerãoProtegido",
      "Vídeo deve ter entre 30 e 60 segundos",
    ],
    audience:
      "Pessoas de 18 a 35 anos que frequentam praias e piscinas",
    deliverables: "1 vídeo para Instagram/TikTok",
    states: ["SP", "RJ", "BA", "CE", "SC"],
  };

  const handleApprove = () => {
    onApprove?.();
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b border-gray-200 dark:border-neutral-700 pb-4 mb-4">
            <img
              src={CampaignLogo}
              alt={extended.title + " logo"}
              className="w-16 h-16 rounded-full object-cover bg-muted border"
            />
            <div className="flex-1 text-center sm:text-left">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {extended.title}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">{extended.brand}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold mt-4">
              {extended.type}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200 dark:border-neutral-700 pb-4">
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">Valor</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">R$ {extended.value?.toLocaleString("pt-BR")}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">Prazo Final</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">{extended.deadline}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">Data de Submissão</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">{extended.submissionDate}</div>
            </div>
          </div>

          {/* Briefing */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Briefing</h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{extended.briefing}</p>
          </section>

          {/* Requirements */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Requisitos</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 text-sm space-y-1">
              {extended.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </section>

          {/* Audience */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Público-Alvo</h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm">{extended.audience}</p>
          </section>

          {/* Deliverables */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Entregáveis</h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm">{extended.deliverables}</p>
          </section>

          {/* States */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Estados</h3>
            <div className="flex flex-wrap gap-2">
              {extended.states.map((uf, i) => (
                <span
                  key={uf}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statesColors[i % statesColors.length]}`}
                >
                  {uf}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <DialogFooter className={`flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200 dark:border-neutral-700 ${path === "pending" ? "flex" : "hidden"}`}>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626]/10"
            onClick={handleReject}
          >
            Rejeitar
          </Button>
          <Button
            className="w-full sm:w-auto bg-[#E91E63] hover:bg-[#E91E63]/90 text-white"
            onClick={handleApprove}
          >
            Aprovar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetail; 