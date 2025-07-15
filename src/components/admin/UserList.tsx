import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../ui/select";

const statusColors = {
    Ativo: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    Bloqueado: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
    Removido: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    Pendente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
};

const users = [
    {
        name: "Ana Silva",
        email: "ana.silva@email.com",
        status: "Aluno",
        statusColor: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
        time: "3 meses",
        campaigns: "12 aplicadas / 5 aprovadas",
        accountStatus: "Ativo",
    },
    {
        name: "Carlos Oliveira",
        email: "carlos.oliveira@email.com",
        status: "Pagante",
        statusColor: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
        time: "Ilimitado",
        campaigns: "8 aplicadas / 6 aprovadas",
        accountStatus: "Bloqueado",
    },
    {
        name: "Mariana Costa",
        email: "mariana.costa@email.com",
        status: "Aluno",
        statusColor: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
        time: "1 mês",
        campaigns: "5 aplicadas / 2 aprovadas",
        accountStatus: "Removido",
    },
    {
        name: "Rafael Santos",
        email: "rafael.santos@email.com",
        status: "Pagante",
        statusColor: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
        time: "Ilimitado",
        campaigns: "15 aplicadas / 10 aprovadas",
        accountStatus: "Ativo",
    },
    {
        name: "Juliana Lima",
        email: "juliana.lima@email.com",
        status: "Aluno",
        statusColor: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
        time: "6 meses",
        campaigns: "3 aplicadas / 1 aprovadas",
        accountStatus: "Pendente",
    },
];

const brands = [
    {
        company: "Marca Solar",
        brandName: "SolarX",
        email: "contato@marcasolar.com",
        campaigns: 3,
        accountStatus: "Ativo",
    },
    {
        company: "Tech Innovations",
        brandName: "TechNova",
        email: "marketing@techinnovations.com",
        campaigns: 1,
        accountStatus: "Bloqueado",
    },
    {
        company: "Presentes Incríveis",
        brandName: "Giftly",
        email: "campanhas@presentesincriveis.com",
        campaigns: 2,
        accountStatus: "Removido",
    },
    {
        company: "HealthTech",
        brandName: "HealthPro",
        email: "parcerias@healthtech.com",
        campaigns: 1,
        accountStatus: "Ativo",
    },
    {
        company: "EcoLife",
        brandName: "EcoLife",
        email: "marketing@ecolife.com",
        campaigns: 1,
        accountStatus: "Pendente",
    },
];

const tabs = [
    { label: "Criadores", key: "creators" },
    { label: "Marcas", key: "brands" },
];

const actionOptions = ["Ativar", "Bloquear", "Remover"];

function handleAdminAction(type, email, action) {
    // Placeholder: Replace with real logic (API call, state update, etc)
    alert(`Admin action: ${action} on ${type} ${email}`);
}

function usePagination(data, initialRowsPerPage = 5) {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
    const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
    const paginated = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const goToPage = (p) => setPage(Math.max(1, Math.min(totalPages, p)));
    React.useEffect(() => { setPage(1); }, [rowsPerPage, data]);
    return { page, setPage: goToPage, rowsPerPage, setRowsPerPage, totalPages, paginated };
}

export default function UserList() {
    const [activeTab, setActiveTab] = useState("creators");
    const isCreators = activeTab === "creators";
    const data = isCreators ? users : brands;
    const { page, setPage, rowsPerPage, setRowsPerPage, totalPages, paginated } = usePagination(data);
    const [openDropdown, setOpenDropdown] = useState(null); // email of open dropdown
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const triggerRefs = useRef({});

    // Close dropdown on outside click
    React.useEffect(() => {
        function handle(e) {
            if (!e.target.closest('.dropdown-action')) setOpenDropdown(null);
        }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, []);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            setOpenDropdown(null);
        };
    }, []);

    // Helper to open dropdown and set position
    const handleDropdownOpen = (email) => {
        const trigger = triggerRefs.current[email];
        if (trigger) {
            const rect = trigger.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
        setOpenDropdown(email);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 dark:bg-neutral-900 min-h-[92vh]">
            <div className="w-full mx-auto">
                <h1 className="text-xl md:text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                    Usuários da Plataforma
                </h1>
                <p className="text-gray-500 dark:text-gray-300 mb-6 text-sm md:text-base">
                    Gerencie criadores e marcas registrados na plataforma
                </p>
                <div className="bg-background p-4 md:p-6 rounded-lg">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-neutral-700 mb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-150
                                        ${activeTab === tab.key
                                        ? "text-[#E91E63] border-b-2 border-[#E91E63]"
                                        : "text-gray-500 dark:text-gray-300 border-b-2 border-transparent hover:text-[#E91E63]"}`}
                                onClick={() => setActiveTab(tab.key)}
                                type="button"
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Responsive Table Container */}
                    <div className="overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">
                            <div className="overflow-hidden border border-gray-200 dark:border-neutral-700 rounded-lg">
                                {isCreators ? (
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                        <thead className="bg-gray-50 dark:bg-neutral-800">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Nome
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                                                    E-mail
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                                                    Tempo
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                                                    Campanhas
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Conta
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                                            {paginated.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">
                                                        Nenhum registro encontrado.
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginated.map((user) => (
                                                    <tr key={user.email} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                                                            {user.email}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.statusColor}`}>
                                                                {user.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                                                            {user.time}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">
                                                            {user.campaigns}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[user.accountStatus]}`}>
                                                                {user.accountStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="relative dropdown-action">
                                                                <button
                                                                    ref={el => triggerRefs.current[user.email] = el}
                                                                    className="border border-gray-300 dark:border-neutral-600 rounded-md px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                                                                    onClick={() => handleDropdownOpen(user.email)}
                                                                    aria-haspopup="true"
                                                                    aria-expanded={openDropdown === user.email}
                                                                >
                                                                    ⋮
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                                        <thead className="bg-gray-50 dark:bg-neutral-800">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Empresa
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                                                    Marca
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                                                    E-mail
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Campanhas
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Conta
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700">
                                            {paginated.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-3 py-8 text-center text-gray-400 dark:text-gray-500">
                                                        Nenhum registro encontrado.
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginated.map((brand) => (
                                                    <tr key={brand.email} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {brand.company}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                                                                    {brand.brandName}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                                                                    {brand.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white hidden sm:table-cell">
                                                            {brand.brandName}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                                                            {brand.email}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                            {brand.campaigns}
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[brand.accountStatus]}`}>
                                                                {brand.accountStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="relative dropdown-action">
                                                                <button
                                                                    ref={el => triggerRefs.current[brand.email] = el}
                                                                    className="border border-gray-300 dark:border-neutral-600 rounded-md px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
                                                                    onClick={() => handleDropdownOpen(brand.email)}
                                                                    aria-haspopup="true"
                                                                    aria-expanded={openDropdown === brand.email}
                                                                >
                                                                    ⋮
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Portal */}
                    {openDropdown && triggerRefs.current[openDropdown] && typeof document !== 'undefined' && createPortal(
                        <div
                            className="fixed z-50 bg-background border border-gray-200 dark:border-neutral-700 rounded shadow-md min-w-[120px]"
                            style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
                            onClick={e => e.stopPropagation()}
                        >
                            {actionOptions.map((action) => (
                                <button
                                    key={action}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200"
                                    onClick={() => { 
                                        handleAdminAction(isCreators ? 'creator' : 'brand', openDropdown, action); 
                                        setOpenDropdown(null); 
                                    }}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>,
                        document.body
                    )}

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Linhas por página:</span>
                            <Select value={String(rowsPerPage)} onValueChange={val => setRowsPerPage(Number(val))}>
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 50].map(n => (
                                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                &lt;
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-300 px-2">
                                {page} de {totalPages}
                            </span>
                            <button
                                className="px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
