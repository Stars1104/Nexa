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
  // Use real campaign data with fallbacks only when needed
  const displayData = {
    ...campaign,
    // Only provide fallbacks if the real data is missing
    submissionDate: campaign.submissionDate || new Date().toLocaleDateString("pt-BR"),
    briefing: campaign.briefing || "Briefing não disponível",
    requirements: campaign.creatorRequirements || ["Requisitos não especificados"],
    audience: "Público-alvo não especificado", // This might not be in the campaign data
    deliverables: "Entregáveis não especificados", // This might not be in the campaign data
    states: Array.isArray(campaign.states) ? campaign.states : ["Estados não especificados"],
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden border">
              {displayData.logo ? (
                <img 
                  src={`http://localhost:8000${displayData.logo}`} 
                  alt={`${displayData.brand?.name || 'Campaign'} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                displayData.brand?.name?.charAt(0)?.toUpperCase() || 'N'
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {displayData.title}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {typeof displayData.brand === 'string' ? displayData.brand : displayData.brand?.name || 'Marca não especificada'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold mt-4">
              {displayData.type}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200 dark:border-neutral-700 pb-4">
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">Valor</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                R$ {(displayData.budget || displayData.value)?.toLocaleString("pt-BR") || 'Não especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">Prazo Final</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {displayData.deadline ? new Date(displayData.deadline).toLocaleDateString("pt-BR") : 'Não especificado'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">Data de Submissão</div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                {displayData.submissionDate ? new Date(displayData.submissionDate).toLocaleDateString("pt-BR") : 'Não especificado'}
              </div>
            </div>
          </div>

          {/* Briefing */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Briefing</h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{displayData.briefing}</p>
          </section>

          {/* Requirements */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Requisitos</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 text-sm space-y-1">
              {Array.isArray(displayData.requirements) ? (
                displayData.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))
              ) : (
                <li>{displayData.requirements}</li>
              )}
            </ul>
          </section>

          {/* Audience */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Público-Alvo</h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm">{displayData.audience}</p>
          </section>

          {/* Deliverables */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Entregáveis</h3>
            <p className="text-gray-700 dark:text-gray-200 text-sm">{displayData.deliverables}</p>
          </section>

          {/* States */}
          <section>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Estados</h3>
            <div className="flex flex-wrap gap-2">
              {displayData.states.map((uf, i) => (
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