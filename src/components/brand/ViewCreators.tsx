import React, { useState } from "react";

const applications = [
  {
    id: 1,
    name: "Ana Silva",
    followers: "32.5K",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    profileUrl: "#",
  },
  {
    id: 2,
    name: "João Costa",
    followers: "78.2K",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    profileUrl: "#",
  },
  {
    id: 3,
    name: "Camila Oliveira",
    followers: "125K",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    profileUrl: "#",
  },
  {
    id: 4,
    name: "Pedro Santos",
    followers: "45.7K",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    profileUrl: "#",
  },
];

interface ViewCreatorsProps {
  setComponent?: (component: string) => void;
}

// Define the status type for each application
type ApplicationStatus = 'pending' | 'approved' | 'rejected';

const ViewCreators: React.FC<ViewCreatorsProps> = ({ setComponent }) => {
  // State to track the status of each application
  const [applicationStatuses, setApplicationStatuses] = useState<Record<number, ApplicationStatus>>({});

  // Handle approve action
  const handleApprove = (applicationId: number) => {
    setApplicationStatuses(prev => ({
      ...prev,
      [applicationId]: 'approved'
    }));
  };

  // Handle reject action
  const handleReject = (applicationId: number) => {
    setApplicationStatuses(prev => ({
      ...prev,
      [applicationId]: 'rejected'
    }));
  };

  // Handle chat navigation
  const handleChat = () => {
    setComponent?.("Chat");
  };

  // Get current status for an application (defaults to 'pending')
  const getApplicationStatus = (applicationId: number): ApplicationStatus => {
    return applicationStatuses[applicationId] || 'pending';
  };

  return (
    <div className="min-h-[92vh] dark:bg-[#171717] px-2 sm:px-10 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button className="text-gray-500 dark:text-gray-300 hover:text-pink-500 transition-colors" aria-label="Voltar para Campanhas" onClick={() => setComponent?.("Minhas campanhas")}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-300 cursor-pointer" onClick={() => setComponent?.("Minhas campanhas")}>Voltar para Campanhas</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">Aplicações para: Lançamento Verão 2024</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base">4 criadores se candidataram para esta campanha</p>
      <div className="space-y-4">
        {applications.map((app) => {
          const status = getApplicationStatus(app.id);
          const isApproved = status === 'approved';
          const isRejected = status === 'rejected';
          
          return (
            <div
              key={app.id}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 border border-gray-100 dark:border-neutral-700"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={app.avatar}
                  alt={app.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-neutral-700"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">{app.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                    <span>{app.followers} seguidores</span>
                    <span className="hidden sm:inline">·</span>
                    <a
                      href={app.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-500 hover:underline flex items-center gap-1 ml-2"
                    >
                      Ver perfil
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 3h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                  <div className="mt-2">
                    {status === 'pending' && (
                      <span className="inline-block bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-3 py-1 rounded-full">Aguardando decisão</span>
                    )}
                    {status === 'approved' && (
                      <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-3 py-1 rounded-full">Aprovado</span>
                    )}
                    {status === 'rejected' && (
                      <span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-3 py-1 rounded-full">Rejeitado</span>
                    )}
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                {isApproved ? (
                  <button 
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors text-sm sm:text-base shadow-sm"
                    onClick={handleChat}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Chat
                  </button>
                ) : (
                  <button 
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base shadow-sm ${
                      isRejected 
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                        : 'bg-[#E91E63] hover:bg-pink-600 text-white'
                    }`}
                    onClick={() => handleApprove(app.id)}
                    disabled={isRejected}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Aprovar
                  </button>
                )}
                <button 
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg border font-medium transition-colors text-sm sm:text-base shadow-sm ${
                    isApproved 
                      ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                      : 'border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => handleReject(app.id)}
                  disabled={isApproved}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Rejeitar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCreators;
