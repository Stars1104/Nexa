import React, { useState } from "react";
import CampaignDetail from "./CampaignDetail";

const TABS = [
  { label: "Todas", value: "all" },
  { label: "Aprovadas", value: "approved" },
  { label: "Pendentes", value: "pending" },
  { label: "Rejeitadas", value: "rejected" },
  { label: "Arquivadas", value: "archived" },
];

const STATUS_STYLES: Record<string, string> = {
  Aprovada: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  Pendente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  Rejeitada: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  Arquivada: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const campaigns = [
  {
    id: 1,
    name: "Campanha de Verão 2023",
    title: "Campanha de Verão 2023",
    status: "Aprovada",
    date: "10/11/2023",
    brand: "Marca Solar",
    approvedCreators: 5,
    type: "Vídeo",
    value: 2500,
    deadline: "15/12/2023",
    submissionDate: "10/11/2023",
    briefing: "Criar conteúdo mostrando produtos de verão em uso na praia. A campanha visa destacar a linha de proteção solar da marca, enfatizando a importância da proteção contra os raios UV.",
    requirements: [
      "Criador deve mostrar o produto sendo aplicado",
      "Mencionar os benefícios de proteção solar",
      "Incluir a hashtag #VerãoProtegido",
      "Vídeo deve ter entre 30 e 60 segundos",
    ],
    audience: "Pessoas de 18 a 35 anos que frequentam praias e piscinas",
    deliverables: "1 vídeo para Instagram/TikTok",
    states: ["SP", "RJ", "BA", "CE", "SC"],
  },
  {
    id: 2,
    name: "Lançamento Produto X",
    title: "Lançamento Produto X",
    status: "Pendente",
    date: "15/11/2023",
    brand: "Tech Innovations",
    approvedCreators: 0,
    type: "Review",
    value: 1800,
    deadline: "20/12/2023",
    submissionDate: "15/11/2023",
    briefing: "Review detalhado do novo produto tecnológico, destacando suas funcionalidades e benefícios para o usuário final.",
    requirements: [
      "Demonstrar todas as funcionalidades principais",
      "Comparar com produtos similares",
      "Incluir opinião pessoal sobre o produto",
      "Vídeo deve ter entre 5 e 10 minutos",
    ],
    audience: "Entusiastas de tecnologia e early adopters",
    deliverables: "1 vídeo para YouTube",
    states: ["SP", "RJ", "MG"],
  },
  {
    id: 3,
    name: "Campanha Natal 2023",
    title: "Campanha Natal 2023",
    status: "Aprovada",
    date: "05/11/2023",
    brand: "Presentes Incríveis",
    approvedCreators: 8,
    type: "Foto",
    value: 1200,
    deadline: "10/12/2023",
    submissionDate: "05/11/2023",
    briefing: "Criar conteúdo natalino mostrando produtos da marca em cenários festivos e familiares.",
    requirements: [
      "Cenário deve ser natalino",
      "Incluir família ou amigos",
      "Mostrar produtos sendo utilizados",
      "Usar hashtag #NatalIncrível",
    ],
    audience: "Famílias e pessoas que celebram o Natal",
    deliverables: "3 fotos para Instagram",
    states: ["SP", "RJ", "RS", "PR"],
  },
  {
    id: 4,
    name: "Review App Fitness",
    title: "Review App Fitness",
    status: "Rejeitada",
    date: "12/11/2023",
    brand: "HealthTech",
    approvedCreators: 0,
    type: "Review",
    value: 1500,
    deadline: "25/11/2023",
    submissionDate: "12/11/2023",
    briefing: "Review do aplicativo de fitness, mostrando suas funcionalidades e resultados obtidos.",
    requirements: [
      "Usar o app por pelo menos 1 semana",
      "Mostrar resultados obtidos",
      "Demonstrar interface do app",
      "Incluir depoimento pessoal",
    ],
    audience: "Pessoas interessadas em fitness e saúde",
    deliverables: "1 vídeo para TikTok",
    states: ["SP", "RJ", "MG", "RS"],
  },
  {
    id: 5,
    name: "Campanha Sustentabilidade",
    title: "Campanha Sustentabilidade",
    status: "Arquivada",
    date: "20/10/2023",
    brand: "EcoLife",
    approvedCreators: 12,
    type: "Vídeo",
    value: 3000,
    deadline: "15/11/2023",
    submissionDate: "20/10/2023",
    briefing: "Campanha focada em sustentabilidade e produtos eco-friendly, mostrando o impacto positivo no meio ambiente.",
    requirements: [
      "Mostrar produtos sustentáveis em uso",
      "Explicar benefícios ambientais",
      "Incluir dicas de sustentabilidade",
      "Usar hashtag #EcoLife",
    ],
    audience: "Pessoas preocupadas com sustentabilidade",
    deliverables: "1 vídeo para Instagram",
    states: ["SP", "RJ", "MG", "RS", "PR", "SC"],
  },
  {
    id: 6,
    name: "Promoção Black Friday",
    title: "Promoção Black Friday",
    status: "Aprovada",
    date: "01/11/2023",
    brand: "Shopping Online",
    approvedCreators: 15,
    type: "Vídeo",
    value: 2000,
    deadline: "30/11/2023",
    submissionDate: "01/11/2023",
    briefing: "Promoção especial para Black Friday, destacando ofertas e descontos exclusivos.",
    requirements: [
      "Mostrar produtos em promoção",
      "Destacar descontos e ofertas",
      "Criar senso de urgência",
      "Incluir link de afiliado",
    ],
    audience: "Consumidores em busca de ofertas",
    deliverables: "1 vídeo para Instagram",
    states: ["SP", "RJ", "MG", "RS", "PR", "SC", "BA"],
  },
  {
    id: 7,
    name: "Lançamento Livro",
    title: "Lançamento Livro",
    status: "Pendente",
    date: "18/11/2023",
    brand: "Editora Cultural",
    approvedCreators: 0,
    type: "Review",
    value: 800,
    deadline: "15/12/2023",
    submissionDate: "18/11/2023",
    briefing: "Review do novo livro lançado pela editora, destacando pontos principais e recomendação.",
    requirements: [
      "Ler o livro completo",
      "Fazer review honesto",
      "Destacar pontos principais",
      "Dar recomendação pessoal",
    ],
    audience: "Leitores e entusiastas de literatura",
    deliverables: "1 vídeo para YouTube",
    states: ["SP", "RJ", "MG"],
  },
];

function filterCampaigns(tab: string) {
  if (tab === "all") return campaigns;
  if (tab === "approved") return campaigns.filter((c) => c.status === "Aprovada");
  if (tab === "pending") return campaigns.filter((c) => c.status === "Pendente");
  if (tab === "rejected") return campaigns.filter((c) => c.status === "Rejeitada");
  if (tab === "archived") return campaigns.filter((c) => c.status === "Arquivada");
  return campaigns;
}

const CampaignList: React.FC = () => {
  const [tab, setTab] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const filtered = filterCampaigns(tab);

  const handleOpenModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-6 py-6 dark:bg-[#171717] min-h-[92vh]">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-gray-900 dark:text-gray-100">Todas as Campanhas</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base">Visualize e gerencie todas as campanhas da plataforma</p>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-5 py-2 rounded-lg font-medium border transition-colors duration-150
              ${tab === t.value
                ? "bg-[#E91E63] text-white border-[#E91E63]"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Table for desktop, cards for mobile */}
      <div className="bg-background rounded-xl shadow p-2 sm:p-6">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 dark:text-gray-400">
                <th className="py-3 px-2 font-medium">Nome</th>
                <th className="py-3 px-2 font-medium">Status</th>
                <th className="py-3 px-2 font-medium">Data de Criação</th>
                <th className="py-3 px-2 font-medium">Marca</th>
                <th className="py-3 px-2 font-medium">Criadores Aprovados</th>
                <th className="py-3 px-2 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="py-4 px-2 text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</td>
                  <td className="py-4 px-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-700 dark:text-gray-300">{c.date}</td>
                  <td className="py-4 px-2 text-sm text-gray-700 dark:text-gray-300">{c.brand}</td>
                  <td className="py-4 px-2 text-sm text-center text-gray-700 dark:text-gray-300">{c.approvedCreators}</td>
                  <td className="py-4 px-2">
                    <button
                      className="px-4 py-2 border border-[#E91E63] text-[#E91E63] rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                      onClick={() => handleOpenModal(c)}
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-4">
          {filtered.map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-100">{c.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[c.status]}`}>{c.status}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Data: <span className="text-gray-700 dark:text-gray-200">{c.date}</span></span>
                <span>Marca: <span className="text-gray-700 dark:text-gray-200">{c.brand}</span></span>
                <span>Criadores: <span className="text-gray-700 dark:text-gray-200">{c.approvedCreators}</span></span>
              </div>
              <div className="mt-2">
                <button
                  className="w-full px-4 py-2 border border-[#E91E63] text-[#E91E63] rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                  onClick={() => handleOpenModal(c)}
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {isModalOpen && selectedCampaign && (
        <CampaignDetail
          campaign={selectedCampaign}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onApprove={() => { }}
          onReject={() => { }}
        />
      )}
    </div>
  );
};

export default CampaignList;
