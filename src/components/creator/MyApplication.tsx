import React from "react";

const applications = [
  {
    campaign: "Resenha Fone de Ouvido",
    brand: "TechSound",
    value: "R$750",
    type: "Review",
    deadline: "15/07/2025",
    status: "Aprovado",
    statusType: "approved",
    action: { label: "Acessar Chat", link: "#", type: "chat" },
  },
  {
    campaign: "Receita Saudável",
    brand: "NutriVida",
    value: "R$350",
    type: "Foto",
    deadline: "20/07/2025",
    status: "Aguardando aprovação",
    statusType: "pending",
    action: { label: "Ver campanha", link: "#", type: "view" },
  },
  {
    campaign: "Rotina de Skincare",
    brand: "BeautyGlow",
    value: "R$600",
    type: "Vídeo",
    deadline: "25/07/2025",
    status: "Rejeitado",
    statusType: "rejected",
    action: { label: "Ver campanha", link: "#", type: "view" },
  },
];

const statusStyles = {
  approved:
    "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  rejected:
    "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300",
};

const MyApplication: React.FC = () => {
  return (
    <div className="p-4 sm:p-8 bg-gray-50 dark:bg-neutral-900 min-h-[92vh]">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Minhas Aplicações
      </h2>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <table className="min-w-full text-sm bg-background">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-300">
                <th className="px-6 py-4 font-semibold">Campanha</th>
                <th className="px-6 py-4 font-semibold">Marca</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Prazo</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-100 dark:border-neutral-700"
                >
                  <td className="px-6 py-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">{app.campaign}</td>
                  <td className="px-6 py-4 text-indigo-500 dark:text-indigo-300 whitespace-nowrap">{app.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.deadline}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[app.statusType]}`}>{app.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.action.type === "chat" ? (
                      <a
                        href={app.action.link}
                        className="text-pink-500 hover:underline font-medium"
                      >
                        {app.action.label}
                      </a>
                    ) : (
                      <a
                        href={app.action.link}
                        className="text-gray-700 dark:text-gray-200 hover:underline font-medium"
                      >
                        {app.action.label}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {applications.map((app, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">Campanha</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">{app.campaign}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">Marca</span>
              <span className="text-indigo-500 dark:text-indigo-300 font-medium">{app.brand}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">Valor</span>
              <span>{app.value}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">Tipo</span>
              <span>{app.type}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">Prazo</span>
              <span>{app.deadline}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[app.statusType]}`}>{app.status}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">Ações</span>
              {app.action.type === "chat" ? (
                <a
                  href={app.action.link}
                  className="text-pink-500 hover:underline font-medium"
                >
                  {app.action.label}
                </a>
              ) : (
                <a
                  href={app.action.link}
                  className="text-gray-700 dark:text-gray-200 hover:underline font-medium"
                >
                  {app.action.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplication;
