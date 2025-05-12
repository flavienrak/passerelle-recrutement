import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Info,
    Plus,
    Users,
    X,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { db } from '../lib/firebase';

const ITEMS_PER_PAGE = 50;

interface Candidate {
    topicOwner: string;
    candidateName: string;
    email: string;
    targetPosition: string;
    location: string;
    targetCompany: string;
    status: 'Waiting candidate' | 'Prequal only' | 'All done';
    comments: string;
    dateAdded: string;
}

interface Report {
    topicOwner: string;
    interlocuteurRH: string;
    company: string;
    candidatEnvoye: string;
    poste: string;
    zoneGeo: string;
    commentaire: string;
    date: string;
    link: string;
}

const reports: Report[] = [
    {
        topicOwner: 'Alice Smith',
        interlocuteurRH: 'Jean Martin',
        company: 'Tech Solutions',
        candidatEnvoye: 'Sophie Bernard',
        poste: 'Lead Developer',
        zoneGeo: 'Paris',
        commentaire: 'Profil très prometteur',
        date: '2025-04-27',
        link: 'https://example.com/report/1',
    },
    {
        topicOwner: 'Bob Johnson',
        interlocuteurRH: 'Marie Dubois',
        company: 'Digital Agency',
        candidatEnvoye: 'Thomas Petit',
        poste: 'UX Designer',
        zoneGeo: 'Lyon',
        commentaire: 'En attente de retour client',
        date: '2025-04-26',
        link: 'https://example.com/report/2',
    },
    {
        topicOwner: 'Carol White',
        interlocuteurRH: 'Pierre Lambert',
        company: 'Innovation Corp',
        candidatEnvoye: 'Julie Martin',
        poste: 'Product Manager',
        zoneGeo: 'Bordeaux',
        commentaire: 'Second entretien planifié',
        date: '2025-04-25',
        link: 'https://example.com/report/3',
    },
];

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = React.useState<
        'home' | 'candidates' | 'clients' | 'about'
    >('home');
    const [editingCell, setEditingCell] = React.useState<{
        row: number;
        field: keyof Report | keyof Candidate;
    } | null>(null);
    const [tableData, setTableData] = React.useState<Report[]>(reports);
    const [candidateData, setCandidateData] = React.useState<Candidate[]>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [filters, setFilters] = React.useState<Record<string, string>>({});

    const activeData = useMemo(
        () =>
            activeSection === 'candidates'
                ? candidateData.filter((row) => row.email !== 'unknown')
                : tableData,
        [activeSection, candidateData, tableData],
    );

    const totalPages = Math.ceil(activeData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = activeData.slice(startIndex, endIndex);

    const handleAddRow = () => {
        if (activeSection === 'candidates') {
            const newCandidate: Candidate = {
                topicOwner: '',
                candidateName: '',
                email: '',
                targetPosition: '',
                location: '',
                targetCompany: '',
                status: 'Waiting candidate',
                comments: '',
                dateAdded: new Date().toISOString().split('T')[0],
            };
            setCandidateData([...candidateData, newCandidate]);
        } else {
            const newRow: Report = {
                topicOwner: '',
                interlocuteurRH: '',
                company: '',
                candidatEnvoye: '',
                poste: '',
                zoneGeo: '',
                commentaire: '',
                date: new Date().toISOString().split('T')[0],
                link: '',
            };
            setTableData([...tableData, newRow]);
        }
        setCurrentPage(Math.ceil((activeData.length + 1) / ITEMS_PER_PAGE));
    };

    const handleDeleteRow = async (index: number, candidate?: Candidate) => {
        if (activeSection === 'candidates') {
            const newData = [...candidateData];
            newData.splice(startIndex + index, 1);
            setCandidateData(newData);

            const q = query(
                collection(db, 'cvs'),
                where('email', '==', candidate!.email),
            );
            const querySnapshot = await getDocs(q);

            for (const doc of querySnapshot.docs) {
                await deleteDoc(doc.ref);
            }
        } else {
            const newData = [...tableData];
            newData.splice(startIndex + index, 1);
            setTableData(newData);
        }

        const newTotalPages = Math.ceil((activeData.length - 1) / ITEMS_PER_PAGE);
        if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
        }
    };

    const handleCellEdit = (index: number, field: string, value: string) => {
        if (activeSection === 'candidates') {
            const newData = [...candidateData];
            newData[startIndex + index] = {
                ...newData[startIndex + index],
                [field]: value,
            };
            setCandidateData(newData);
        } else {
            const newData = [...tableData];
            newData[startIndex + index] = {
                ...newData[startIndex + index],
                [field]: value,
            };
            setTableData(newData);
        }
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditingCell(null);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        setTimeout(() => {
            try {
                if (
                    document.body.contains(currentTarget) &&
                    document.activeElement &&
                    !currentTarget.contains(document.activeElement)
                ) {
                    setEditingCell(null);
                }
            } catch (error) {
                setEditingCell(null);
            }
        }, 100);
    };

    const renderCandidatesTable = () => {
        return (
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#1A1E2E] to-[#292E3E] border-b border-gray-700/50">
                                {['topicOwner', 'candidateName', 'email'].map((field) => (
                                    <th
                                        key={field}
                                        className="text-left p-4 first:rounded-tl-lg"
                                    >
                                        <div className="space-y-2">
                                            <div className="text-[#FF6B00] font-medium">
                                                {field === 'topicOwner' && 'Topic owner'}
                                                {field === 'candidateName' &&
                                                    'Nom du candidat'}
                                                {field === 'email' && 'Email'}
                                            </div>
                                            <input
                                                type="text"
                                                value={filters[field] || ''}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        [field]: e.target.value,
                                                    }))
                                                }
                                                placeholder="Filtrer..."
                                                className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/50 focus:border-[#FF6B00]/30 transition-all duration-200"
                                            />
                                        </div>
                                    </th>
                                ))}
                                <th className="text-left p-4 text-[#FF6B00] font-medium">
                                    <div className="space-y-2">
                                        <div className="text-[#FF6B00] font-medium">
                                            Report
                                        </div>
                                        <div className="h-[34px]"></div>
                                    </div>
                                </th>
                                {[
                                    'targetPosition',
                                    'location',
                                    'targetCompany',
                                    'status',
                                    'comments',
                                    'dateAdded',
                                ].map((field) => (
                                    <th key={field} className="text-left p-4">
                                        <div className="space-y-2">
                                            <div className="text-[#FF6B00] font-medium">
                                                {field === 'targetPosition' &&
                                                    'Poste visé'}
                                                {field === 'location' && 'Localisation'}
                                                {field === 'targetCompany' &&
                                                    'Entreprise cible'}
                                                {field === 'status' && 'Statut'}
                                                {field === 'comments' && 'Commentaires'}
                                                {field === 'dateAdded' && "Date d'ajout"}
                                            </div>
                                            <input
                                                type="text"
                                                value={filters[field] || ''}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        [field]: e.target.value,
                                                    }))
                                                }
                                                placeholder="Filtrer..."
                                                className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/50 focus:border-[#FF6B00]/30 transition-all duration-200"
                                            />
                                        </div>
                                    </th>
                                ))}
                                <th className="text-left p-4 text-[#FF6B00] font-medium rounded-tr-lg">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(currentData as Candidate[]).map((candidate, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-700/50 last:border-0 transition-colors duration-200 ${
                                        index % 2 === 0
                                            ? 'bg-[#1A1E2E]/20'
                                            : 'bg-transparent'
                                    } hover:bg-[#1A1E2E]/40`}
                                >
                                    {(
                                        [
                                            'topicOwner',
                                            'candidateName',
                                            'email',
                                        ] as (keyof Candidate)[]
                                    ).map((field) => (
                                        <td
                                            key={field}
                                            className="p-4 text-white cursor-pointer"
                                            onClick={() =>
                                                setEditingCell({ row: index, field })
                                            }
                                        >
                                            {editingCell?.row === index &&
                                            editingCell?.field === field ? (
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-800 border border-[#FF6B00] rounded px-2 py-1.5 text-white focus:ring-2 focus:ring-[#FF6B00]/30 focus:outline-none"
                                                    value={candidate[field] || ''}
                                                    onChange={(e) =>
                                                        handleCellEdit(
                                                            index,
                                                            field,
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={handleKeyDown}
                                                    onBlur={handleBlur}
                                                    ref={inputRef}
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    className={`min-h-[24px] rounded transition-colors duration-200 ${
                                                        !candidate[field]
                                                            ? 'bg-gray-800/30 px-2'
                                                            : 'px-2 hover:bg-[#FF6B00]/10'
                                                    }`}
                                                >
                                                    {candidate[field] || (
                                                        <span className="text-gray-500 italic">
                                                            Vide
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (candidate.email !== 'unknown')
                                                    navigate(
                                                        `/client-report/${candidate.email}`,
                                                    );
                                            }}
                                            className="bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border-[#FF6B00]/30 text-[#FF6B00] w-8 h-8 flex items-center justify-center"
                                        >
                                            R
                                        </Button>
                                    </td>
                                    {(
                                        [
                                            'targetPosition',
                                            'location',
                                            'targetCompany',
                                            'status',
                                            'comments',
                                            'dateAdded',
                                        ] as (keyof Candidate)[]
                                    ).map((field) => (
                                        <td
                                            key={field}
                                            className="p-4 text-white cursor-pointer"
                                            onClick={() =>
                                                setEditingCell({ row: index, field })
                                            }
                                        >
                                            {editingCell?.row === index &&
                                            editingCell?.field === field ? (
                                                <input
                                                    type="text"
                                                    className="w-full bg-gray-800 border border-[#FF6B00] rounded px-2 py-1.5 text-white focus:ring-2 focus:ring-[#FF6B00]/30 focus:outline-none"
                                                    value={
                                                        field === 'dateAdded' &&
                                                        candidate[field]
                                                            ? String(
                                                                  candidate[field],
                                                              ).split('T')[0]
                                                            : candidate[field] || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleCellEdit(
                                                            index,
                                                            field,
                                                            e.target.value,
                                                        )
                                                    }
                                                    onKeyDown={handleKeyDown}
                                                    onBlur={handleBlur}
                                                    ref={inputRef}
                                                    autoFocus
                                                />
                                            ) : (
                                                <div
                                                    className={`min-h-[24px] rounded transition-colors duration-200 ${
                                                        !candidate[field]
                                                            ? 'bg-gray-800/30 px-2'
                                                            : 'px-2 hover:bg-[#FF6B00]/10'
                                                    }`}
                                                >
                                                    {field === 'dateAdded' &&
                                                    candidate[field]
                                                        ? new Date(
                                                              candidate[field] as string,
                                                          ).toLocaleDateString('fr-FR')
                                                        : candidate[field] || (
                                                              <span className="text-gray-500 italic">
                                                                  Vide
                                                              </span>
                                                          )}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteRow(index, candidate)
                                            }
                                            className="bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border-[#FF6B00]/30 text-[#FF6B00]"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-700/50 px-4 py-3 bg-gradient-to-r from-[#1A1E2E] to-[#292E3E]">
                    <div className="flex items-center text-sm text-gray-400">
                        <span>
                            Affichage {startIndex + 1}-
                            {Math.min(endIndex, activeData.length)} sur{' '}
                            {activeData.length}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>

                        <span className="text-white px-4">
                            Page {currentPage} sur {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="px-2"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        );
    };

    async function getCandidatesFromFirestore() {
        const querySnapshot = await getDocs(collection(db, 'cvs'));
        const fetchedCandidates = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                topicOwner: '',
                candidateName: data.fileName || '',
                email: data.email || '',
                targetPosition: '',
                location: '',
                targetCompany: '',
                status: 'Waiting candidate',
                comments: data.parsedData?.centres_interet?.[0] || '',
                dateAdded: data.uploadedAt || '',
            };
        });
        setCandidateData(fetchedCandidates as Candidate[]);
    }

    React.useEffect(() => {
        getCandidatesFromFirestore();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0E17] to-[#1A1E2E] flex">
            {/* Left Menu */}
            <div className="w-64 bg-[#1A1E2E]/80 backdrop-blur-sm border-r border-gray-700/50 p-6">
                <div className="flex items-center mb-8">
                    <img
                        src="https://res.cloudinary.com/dsvix5dzy/image/upload/v1745781614/Sans_titre-1_77_jst63e.png"
                        alt="Les recruteurs"
                        className="h-8 mr-2"
                    />
                </div>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveSection('candidates')}
                        className={`w-full flex items-center px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors group ${
                            activeSection === 'candidates' ? 'bg-white/5' : ''
                        }`}
                    >
                        <Users className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#FF6B00]" />
                        <span>Candidats</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('clients')}
                        className={`w-full flex items-center px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors group ${
                            activeSection === 'clients' ? 'bg-white/5' : ''
                        }`}
                    >
                        <Building2 className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#FF6B00]" />
                        <span>Clients</span>
                    </button>

                    <button
                        onClick={() => setActiveSection('about')}
                        className={`w-full flex items-center px-4 py-2 text-white hover:bg-white/5 rounded-lg transition-colors group ${
                            activeSection === 'about' ? 'bg-white/5' : ''
                        }`}
                    >
                        <Info className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#FF6B00]" />
                        <span>Nous</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {activeSection === 'candidates' ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white">
                                Espace Candidats
                            </h1>
                            <Button
                                onClick={handleAddRow}
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Ajouter un candidat
                            </Button>
                        </div>
                        {renderCandidatesTable()}
                    </div>
                ) : activeSection === 'clients' ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-white">
                                Espace Client
                            </h1>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleAddRow}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    Ajouter une ligne
                                </Button>
                                <Button
                                    onClick={() => navigate('/reporting')}
                                    className="flex items-center gap-2"
                                >
                                    <FileText className="w-5 h-5" />
                                    Voir modèle reporting
                                </Button>
                            </div>
                        </div>

                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-[#1A1E2E] to-[#292E3E] border-b border-gray-700/50">
                                            {[
                                                'topicOwner',
                                                'interlocuteurRH',
                                                'company',
                                                'candidatEnvoye',
                                                'poste',
                                                'zoneGeo',
                                                'commentaire',
                                                'date',
                                            ].map((field) => (
                                                <th
                                                    key={field}
                                                    className="text-left p-4 first:rounded-tl-lg"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="text-[#FF6B00] font-medium">
                                                            {field === 'topicOwner' &&
                                                                'Topic owner'}
                                                            {field ===
                                                                'interlocuteurRH' &&
                                                                'Interlocuteur RH'}
                                                            {field === 'company' &&
                                                                'Entreprise'}
                                                            {field === 'candidatEnvoye' &&
                                                                'Candidat envoyé'}
                                                            {field === 'poste' && 'Poste'}
                                                            {field === 'zoneGeo' &&
                                                                'Zone géo'}
                                                            {field === 'commentaire' &&
                                                                'Commentaire'}
                                                            {field === 'date' &&
                                                                "Date d'envoi"}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={
                                                                filters[
                                                                    field as keyof Report
                                                                ] || ''
                                                            }
                                                            onChange={(e) =>
                                                                setFilters((prev) => ({
                                                                    ...prev,
                                                                    [field]:
                                                                        e.target.value,
                                                                }))
                                                            }
                                                            placeholder="Filtrer..."
                                                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]/50 focus:border-[#FF6B00]/30 transition-all duration-200"
                                                        />
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="text-left p-4 text-[#FF6B00] font-medium">
                                                Reporting
                                            </th>
                                            <th className="text-left p-4 text-[#FF6B00] font-medium rounded-tr-lg">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(currentData as Report[]).map(
                                            (report, index) => (
                                                <tr
                                                    key={index}
                                                    className={`border-b border-gray-700/50 last:border-0 transition-colors duration-200 ${
                                                        index % 2 === 0
                                                            ? 'bg-[#1A1E2E]/20'
                                                            : 'bg-transparent'
                                                    } hover:bg-[#1A1E2E]/40`}
                                                >
                                                    <td
                                                        className="p-4 text-white cursor-pointer"
                                                        onClick={() =>
                                                            setEditingCell({
                                                                row: index,
                                                                field: 'topicOwner',
                                                            })
                                                        }
                                                    >
                                                        {editingCell?.row === index &&
                                                        editingCell?.field ===
                                                            'topicOwner' ? (
                                                            <input
                                                                type="text"
                                                                className="w-full bg-gray-800 border border-[#FF6B00] rounded px-2 py-1.5 text-white focus:ring-2 focus:ring-[#FF6B00]/30 focus:outline-none"
                                                                value={
                                                                    report.topicOwner ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleCellEdit(
                                                                        index,
                                                                        'topicOwner',
                                                                        e.target.value,
                                                                    )
                                                                }
                                                                onKeyDown={handleKeyDown}
                                                                onBlur={handleBlur}
                                                                ref={inputRef}
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <div
                                                                className={`min-h-[24px] rounded transition-colors duration-200 ${
                                                                    !report.topicOwner
                                                                        ? 'bg-gray-800/30 px-2'
                                                                        : 'px-2 hover:bg-[#FF6B00]/10'
                                                                }`}
                                                            >
                                                                {report.topicOwner || (
                                                                    <span className="text-gray-500 italic">
                                                                        Vide
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    {(
                                                        [
                                                            'interlocuteurRH',
                                                            'company',
                                                            'candidatEnvoye',
                                                            'poste',
                                                            'zoneGeo',
                                                            'commentaire',
                                                            'date',
                                                        ] as const
                                                    ).map((field) => (
                                                        <td
                                                            key={field}
                                                            className="p-4 text-white cursor-pointer"
                                                            onClick={() =>
                                                                setEditingCell({
                                                                    row: index,
                                                                    field,
                                                                })
                                                            }
                                                        >
                                                            {editingCell?.row === index &&
                                                            editingCell?.field ===
                                                                field ? (
                                                                <input
                                                                    type="text"
                                                                    className="w-full bg-gray-800 border border-[#FF6B00] rounded px-2 py-1.5 text-white focus:ring-2 focus:ring-[#FF6B00]/30 focus:outline-none"
                                                                    value={
                                                                        field === 'date'
                                                                            ? report[
                                                                                  field
                                                                              ].split(
                                                                                  'T',
                                                                              )[0]
                                                                            : report[
                                                                                  field
                                                                              ]
                                                                    }
                                                                    onChange={(e) =>
                                                                        handleCellEdit(
                                                                            index,
                                                                            field,
                                                                            e.target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    onKeyDown={
                                                                        handleKeyDown
                                                                    }
                                                                    onBlur={handleBlur}
                                                                    ref={inputRef}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <div
                                                                    className={`min-h-[24px] rounded transition-colors duration-200 ${
                                                                        !report[field]
                                                                            ? 'bg-gray-800/30 px-2'
                                                                            : 'px-2 hover:bg-[#FF6B00]/10'
                                                                    }`}
                                                                >
                                                                    {field === 'date'
                                                                        ? new Date(
                                                                              report[
                                                                                  field
                                                                              ],
                                                                          ).toLocaleDateString(
                                                                              'fr-FR',
                                                                          )
                                                                        : report[
                                                                              field
                                                                          ] || (
                                                                              <span className="text-gray-500 italic">
                                                                                  Vide
                                                                              </span>
                                                                          )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    ))}
                                                    <td className="p-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate('/client-report')
                                                            }
                                                            className="bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border-[#FF6B00]/30 text-[#FF6B00] w-8 h-8 flex items-center justify-center"
                                                        >
                                                            T
                                                        </Button>
                                                    </td>
                                                    <td className="p-4 flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/client-report/${report.candidatEnvoye}`,
                                                                )
                                                            }
                                                            className="bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border-[#FF6B00]/30 text-[#FF6B00] w-8 h-8 flex items-center justify-center"
                                                        >
                                                            R
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteRow(index)
                                                            }
                                                            className="bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border-[#FF6B00]/30 text-[#FF6B00]"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between border-t border-gray-700/50 px-4 py-3 bg-gradient-to-r from-[#1A1E2E] to-[#292E3E]">
                                <div className="flex items-center text-sm text-gray-400">
                                    <span>
                                        Affichage {startIndex + 1}-
                                        {Math.min(endIndex, activeData.length)} sur{' '}
                                        {activeData.length}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((p) => Math.max(1, p - 1))
                                        }
                                        disabled={currentPage === 1}
                                        className="px-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>

                                    <span className="text-white px-4">
                                        Page {currentPage} sur {totalPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setCurrentPage((p) =>
                                                Math.min(totalPages, p + 1),
                                            )
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-2"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Découvrez votre potentiel cognitif
                            </h1>
                            <p className="text-xl text-gray-300 mb-8">
                                Boostez votre employabilité grâce à l'analyse cognitive
                                Les recruteurs
                            </p>

                            <Button
                                size="lg"
                                onClick={() => navigate('/cv-upload')}
                                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8124] hover:from-[#FF8124] hover:to-[#FF9346] transition-all duration-300"
                            >
                                Espace Candidat
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-[#1A1E2E]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                                <Users className="w-12 h-12 text-[#FF6B00] mb-4" />
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Candidats
                                </h2>
                                <p className="text-gray-300">
                                    Découvrez vos forces cognitives et maximisez vos
                                    chances en entretien.
                                </p>
                            </div>

                            <div className="bg-[#1A1E2E]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                                <Building2 className="w-12 h-12 text-[#FF6B00] mb-4" />
                                <h2 className="text-xl font-bold text-white mb-2">
                                    Clients
                                </h2>
                                <p className="text-gray-300">
                                    Optimisez vos recrutements grâce à notre analyse
                                    cognitive avancée.
                                </p>
                            </div>

                            <div className="bg-[#1A1E2E]/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                                <Info className="w-12 h-12 text-[#FF6B00] mb-4" />
                                <h2 className="text-xl font-bold text-white mb-2">
                                    À propos
                                </h2>
                                <p className="text-gray-300">
                                    Une approche scientifique et innovante du recrutement.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
