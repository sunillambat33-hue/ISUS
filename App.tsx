
import React, { useState, useEffect } from 'react';
import { CLASSES, SPECIAL_CLASSES, BOARDS, EXAMS, MOCK_QUESTIONS, RESOURCES, SYLLABUS_DATA } from './constants';
import { Question, ExamResult, PageState, Reminder } from './types';
import { explainQuestion, generateQuizQuestion, generateStudyNotes, generateChapterSummary, generatePracticeSet } from './services/geminiService';
import BottomNav from './components/BottomNav';
import { 
  ChevronLeft, 
  Menu, 
  Share2, 
  MoreVertical, 
  Search, 
  X, 
  Pause, 
  BookOpen, 
  PenTool, 
  Eraser, 
  Download,
  Trophy,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Copy,
  Check,
  Bell,
  Calendar,
  Settings,
  User,
  LogOut,
  Zap,
  Clock,
  AlarmClock,
  Eye,
  LayoutGrid, 
  FileQuestion, 
  ShieldCheck, 
  Bookmark, 
  FileText,
  Sun,
  Star,
  Crown,
  Trash2,
  Info,
  GraduationCap,
  PlayCircle,
  HelpCircle
} from 'lucide-react';

// Types for User Preferences
interface UserPrefs {
    classes: string[];
    boards: string[];
    exams: string[];
}

interface UserProfileData {
    name: string;
    avatar: string;
}

type BookmarkCategory = 'QUESTIONS' | 'BOOKS' | 'PDFS' | 'ARTICLES';

// --- COMPONENTS DEFINED WITHIN APP TO SIMPLIFY SINGLE-FILE XML REQUIREMENT FOR COMPLEX NAV ---

// Rate Us Modal
const RateUsModal = ({ onClose }: { onClose: () => void }) => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(onClose, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 px-4">
             <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200 text-center relative">
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full"><X size={16} /></button>
                 
                 {submitted ? (
                     <div className="py-6 flex flex-col items-center">
                         <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                             <Check size={32} strokeWidth={3} />
                         </div>
                         <h3 className="text-xl font-bold text-gray-800">Thank You!</h3>
                         <p className="text-gray-500 mt-2 text-sm">Your feedback helps us improve.</p>
                     </div>
                 ) : (
                     <>
                        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-4">
                             <Star size={28} fill="currentColor" />
                         </div>
                         <h3 className="text-xl font-bold text-gray-800 mb-2">Rate SelfStudys</h3>
                         <p className="text-gray-500 text-sm mb-6 leading-relaxed">If you enjoy using the app, please take a moment to rate us.</p>
                         
                         <div className="flex justify-center gap-3 mb-8">
                             {[1, 2, 3, 4, 5].map((star) => (
                                 <button
                                     key={star}
                                     onClick={() => setRating(star)}
                                     className="transition-transform hover:scale-110 focus:outline-none"
                                 >
                                     <Star 
                                         size={32} 
                                         className={`${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'} transition-colors duration-200`} 
                                     />
                                 </button>
                             ))}
                         </div>
                         
                         <button 
                             onClick={handleSubmit}
                             disabled={rating === 0}
                             className={`w-full py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2
                                 ${rating > 0 
                                     ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg translate-y-0' 
                                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                         >
                             Submit
                         </button>
                     </>
                 )}
             </div>
        </div>
    );
};

// Sidebar Component
const Sidebar = ({
  isOpen,
  onClose,
  userProfile,
  onNavigate,
  onEditPrefs,
  isDarkMode,
  onToggleDarkMode,
  onOpenBookmarks,
  onRateUs
}: {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileData;
  onNavigate: (page: PageState) => void;
  onEditPrefs: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBookmarks: (category: BookmarkCategory) => void;
  onRateUs: () => void;
}) => {
  if (!isOpen) return null;

  const SidebarItem = ({ icon: Icon, label, onClick, isToggle, isActive }: any) => (
    <button 
        onClick={onClick} 
        className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-blue-50 transition-colors text-gray-700 font-medium text-left"
    >
        <div className="flex items-center gap-4">
            <Icon size={22} className="text-blue-500" strokeWidth={1.5} />
            <span className="text-sm">{label}</span>
        </div>
        {isToggle && (
             <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow border border-gray-200 absolute top-0 transition-all duration-300 ${isActive ? 'left-5 border-blue-500' : 'left-0'}`}></div>
            </div>
        )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative w-[80%] max-w-[300px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        
        {/* Header */}
        <div className="bg-blue-500 p-6 pt-10 pb-12 text-white relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white rounded-full p-0.5 overflow-hidden flex-shrink-0">
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                    <h2 className="font-bold text-lg leading-tight truncate max-w-[150px]">{userProfile.name}</h2>
                    <div className="flex items-center gap-1.5 text-blue-100">
                        <GraduationCap size={18} />
                        <p className="font-bold text-lg">Self<span className="text-white">Studys</span></p>
                    </div>
                </div>
            </div>

            {/* Complete Profile Banner */}
            <button 
                onClick={() => { onNavigate(PageState.PROFILE); onClose(); }}
                className="absolute right-0 bottom-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold py-1.5 pl-4 pr-3 rounded-l-full flex items-center gap-1 shadow-md hover:bg-yellow-300 transition"
            >
                Complete Profile <ArrowRight size={12} />
            </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
            <div className="py-2">
                <SidebarItem icon={User} label="Profile" onClick={() => { onNavigate(PageState.PROFILE); onClose(); }} />
                <SidebarItem icon={Settings} label="Change Exam" onClick={() => { onEditPrefs(); onClose(); }} />
                <SidebarItem icon={Sun} label="Night Mode" isToggle={true} isActive={isDarkMode} onClick={onToggleDarkMode} />
                <SidebarItem icon={Trophy} label="LeaderBoard" onClick={() => { onNavigate(PageState.LEADERBOARD); onClose(); }} />
                <SidebarItem icon={FileQuestion} label="Que Bookmarked" onClick={() => { onOpenBookmarks('QUESTIONS'); onClose(); }} />
                <SidebarItem icon={BookOpen} label="Downloaded Books" onClick={() => { onOpenBookmarks('BOOKS'); onClose(); }} />
                <SidebarItem icon={FileText} label="PDF Bookmarked" onClick={() => { onOpenBookmarks('PDFS'); onClose(); }} />
                <SidebarItem icon={Bookmark} label="Article Bookmarked" onClick={() => { onOpenBookmarks('ARTICLES'); onClose(); }} />
            </div>

            <div className="border-t border-gray-100 my-2 pt-2">
                <p className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Communicate</p>
                <SidebarItem icon={LayoutGrid} label="More Apps" onClick={() => {}} />
                <SidebarItem icon={Share2} label="App Share" onClick={() => {}} />
                <SidebarItem icon={Star} label="Rate Us" onClick={() => { onRateUs(); onClose(); }} />
                <SidebarItem icon={ShieldCheck} label="Privacy Policy" onClick={() => {}} />
                <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
            </div>
        </div>
      </div>
    </div>
  );
};

// 1. Onboarding Component
const Onboarding = ({ initialPrefs, onSave }: { initialPrefs?: UserPrefs, onSave: (prefs: UserPrefs) => void }) => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>(initialPrefs?.classes || []);
  const [selectedBoards, setSelectedBoards] = useState<string[]>(initialPrefs?.boards || []);
  const [selectedExams, setSelectedExams] = useState<string[]>(initialPrefs?.exams || []);

  const toggleClass = (cls: string) => {
    if (selectedClasses.includes(cls)) {
      setSelectedClasses(selectedClasses.filter(c => c !== cls));
    } else {
      if (selectedClasses.length < 2) {
        setSelectedClasses([...selectedClasses, cls]);
      } else {
        // Replace the first one (FIFO-ish behavior for UX)
        setSelectedClasses([selectedClasses[1], cls]);
      }
    }
  };

  const toggleBoard = (board: string) => {
    if (selectedBoards.includes(board)) {
      setSelectedBoards(selectedBoards.filter(b => b !== board));
    } else {
      setSelectedBoards([...selectedBoards, board]);
    }
  };
  
  const toggleExam = (exam: string) => {
      if (selectedExams.includes(exam)) {
          setSelectedExams(selectedExams.filter(e => e !== exam));
      } else {
          setSelectedExams([...selectedExams, exam]);
      }
  }

  const handleSave = () => {
      // Default fallback if nothing selected
      const finalClasses = selectedClasses.length > 0 ? selectedClasses : ['12'];
      const finalBoards = selectedBoards.length > 0 ? selectedBoards : ['CBSE'];
      const finalExams = selectedExams;

      onSave({
          classes: finalClasses,
          boards: finalBoards,
          exams: finalExams
      });
  };

  return (
    <div className="bg-white min-h-screen pb-20 relative">
        {/* Header */}
        <div className="bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 text-teal-500">
                <GraduationCap size={24} />
                <span className="text-xl font-bold">SelfStudys</span>
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100" onClick={handleSave}>
                <X size={24} className="text-gray-600" />
            </button>
        </div>

        <div className="p-4 space-y-6">
            {/* Class Selection */}
            <section>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                       <BookOpen size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">Select Classes</h2>
                        <p className="text-xs text-gray-500">You can select 2 classes</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mt-4">
                    {CLASSES.map(cls => (
                        <button
                            key={cls}
                            onClick={() => toggleClass(cls)}
                            className={`h-12 rounded-md font-medium text-lg transition-colors shadow-sm border
                                ${selectedClasses.includes(cls) 
                                    ? 'bg-emerald-500 text-white border-emerald-500' 
                                    : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100'}`}
                        >
                            {cls}
                        </button>
                    ))}
                </div>
                <div className="flex gap-3 mt-3">
                    {SPECIAL_CLASSES.map(cls => (
                        <button 
                            key={cls}
                            onClick={() => toggleClass(cls)}
                            className={`flex-1 h-10 rounded-md font-medium text-sm transition-colors shadow-sm border
                            ${selectedClasses.includes(cls) 
                                ? 'bg-emerald-500 text-white border-emerald-500' 
                                : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100'}`}
                        >
                            {cls}
                        </button>
                    ))}
                </div>
            </section>

            {/* Board Selection */}
            <section>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                       <Trophy size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">Select Your Board</h2>
                        <p className="text-xs text-gray-500">You can select multiple board</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {BOARDS.map(board => (
                        <button
                            key={board}
                            onClick={() => toggleBoard(board)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border
                                ${selectedBoards.includes(board)
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-emerald-50 text-emerald-900 border-emerald-100'}`}
                        >
                            {board}
                        </button>
                    ))}
                </div>
            </section>
            
            {/* Exam Selection */}
            <section>
                <div className="flex items-center gap-2 mb-2">
                     <div className="p-2 bg-blue-100 rounded-lg">
                       <Lightbulb size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-800">Preparing Exam</h2>
                        <p className="text-xs text-gray-500">Select exam you are preparing for</p>
                    </div>
                </div>
                 <div className="flex flex-wrap gap-2 mt-4">
                    {EXAMS.map(exam => (
                        <button
                            key={exam}
                            onClick={() => toggleExam(exam)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border
                                ${selectedExams.includes(exam)
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-emerald-50 text-emerald-900 border-emerald-100'}`}
                        >
                            {exam}
                        </button>
                    ))}
                </div>
            </section>
        </div>

        {/* Sticky Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-20 max-w-md mx-auto">
            <button 
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
                Save
            </button>
        </div>
    </div>
  );
};

// 2. Home Component
const Home = ({ 
    userPrefs, 
    userProfile,
    onStartTest, 
    onOpenPDF, 
    onOpenSyllabus, 
    onOpenAINotes, 
    onOpenSamplePaper,
    onOpenQuiz,
    onEditPrefs,
    onNavigate,
    isDarkMode,
    onToggleDarkMode,
    onOpenBookmarks
}: { 
    userPrefs: UserPrefs, 
    userProfile: UserProfileData,
    onStartTest: () => void, 
    onOpenPDF: () => void,
    onOpenSyllabus: (selectedClass: string) => void,
    onOpenAINotes: (selectedClass: string) => void,
    onOpenSamplePaper: (selectedClass: string) => void,
    onOpenQuiz: (selectedClass: string) => void,
    onEditPrefs: () => void,
    onNavigate: (page: PageState) => void,
    isDarkMode: boolean,
    onToggleDarkMode: () => void,
    onOpenBookmarks: (category: BookmarkCategory) => void
}) => {
  const [viewClass, setViewClass] = useState<string>(userPrefs.classes[0] || '12');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRateUsOpen, setIsRateUsOpen] = useState(false);

  useEffect(() => {
    if (userPrefs.classes.length > 0 && !userPrefs.classes.includes(viewClass)) {
        setViewClass(userPrefs.classes[0]);
    } else if (userPrefs.classes.length > 0 && userPrefs.classes.includes(viewClass)) {
        // do nothing
    } else {
        setViewClass('12');
    }
  }, [userPrefs]);

  const displayBoard = userPrefs.boards[0] || 'CBSE';

  const handleResourceClick = (item: { id: string, title: string }) => {
      if (item.title.includes('Mock') || item.title.includes('Exemplar')) {
          onOpenQuiz(viewClass); // Redirect Mock Tests to AI Quiz
      } else if (item.id === '5' || item.title.includes('Syllabus')) {
          onOpenSyllabus(viewClass);
      } else if (item.title.includes('Notes')) {
          onOpenAINotes(viewClass);
      } else if (item.title.includes('Sample Paper')) {
          onOpenSamplePaper(viewClass);
      } else {
          onOpenPDF();
      }
  };

  return (
    <div className={`min-h-screen pb-20 relative ${isDarkMode ? 'bg-gray-900' : 'bg-blue-500'}`}>
        <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            userProfile={userProfile}
            onNavigate={onNavigate}
            onEditPrefs={onEditPrefs}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            onOpenBookmarks={onOpenBookmarks}
            onRateUs={() => setIsRateUsOpen(true)}
        />
        
        {isRateUsOpen && <RateUsModal onClose={() => setIsRateUsOpen(false)} />}

        {/* Header Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-500'} text-white p-4 pb-8 rounded-b-[2rem] transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-white/10 rounded-full transition">
                    <Menu size={24} />
                </button>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <GraduationCap size={26} />
                    SelfStudys
                </h1>
                <Share2 size={24} />
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm">Selected</p>
                        <h2 className="text-xl font-bold">{viewClass} Class</h2>
                    </div>
                    <button 
                        onClick={onEditPrefs}
                        className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition border border-white/20"
                    >
                        Change
                    </button>
                </div>

                {/* Class Switcher */}
                {userPrefs.classes.length > 1 && (
                    <div className="mt-3 flex gap-2 bg-black/20 p-1 rounded-lg w-fit">
                        {userPrefs.classes.map(cls => (
                            <button
                                key={cls}
                                onClick={() => setViewClass(cls)}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                                    viewClass === cls 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {cls}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Content Section */}
        <div className={`min-h-screen rounded-t-[2rem] -mt-6 p-6 shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-6">
                 <div>
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{displayBoard} - {viewClass}</h2>
                    <p className="text-xs text-gray-500">Study Materials PDF & MCQ's Tests</p>
                 </div>
                 <Search className="text-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {RESOURCES.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => handleResourceClick(item)}
                        className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : item.color + ' border-gray-100'} p-4 rounded-xl shadow-sm border flex items-start gap-3 hover:shadow-md transition-all text-left group`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                            {item.icon === 'book' && <BookOpen size={20} />}
                            {item.icon === 'award' && <Trophy size={20} />}
                            {item.icon === 'file-text' && <Sparkles size={20} />}
                            {item.icon === 'check-circle' && <RefreshCw size={20} />}
                            {item.icon === 'list' && <Menu size={20} />}
                            {item.icon === 'file' && <ArrowRight size={20} />}
                            {item.icon === 'clock' && <RefreshCw size={20} />}
                            {item.icon === 'edit' && <PenTool size={20} />}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-sm font-semibold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {item.title.replace('NCERT', `Class ${viewClass}`).replace('CBSE Syllabus', `${viewClass} Syllabus`)}
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-1">View Resource</p>
                        </div>
                    </button>
                ))}
            </div>
            
            {/* Promo Banner */}
            <div className="mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="font-bold text-lg">Unlock Premium</h3>
                    <p className="text-xs text-purple-100 mb-3">Get unlimited access to all tests & PDFs</p>
                    <button className="bg-white text-purple-600 text-xs px-4 py-2 rounded-full font-bold">Explore Now</button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
                     <Trophy size={100} />
                </div>
            </div>
        </div>
    </div>
  );
};

// 3. Test Interface Component
const TestInterface = ({ onFinish }: { onFinish: (result: ExamResult) => void }) => {
    // ... [Existing implementation] ...
    // Placeholder to keep the file valid, using standard implementation
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [timer, setTimer] = useState(600); // 10 minutes
    const [answers, setAnswers] = useState<{[key: number]: number}>({}); // qId -> optionIndex
    const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(answers[questions[currentQuestionIndex + 1].id] ?? null);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setSelectedOption(answers[questions[currentQuestionIndex - 1].id] ?? null);
        }
    };

    const handleSelect = (idx: number) => {
        setSelectedOption(idx);
        setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: idx }));
    };

    const handleSubmit = () => {
        let correct = 0;
        let wrong = 0;
        let skipped = 0;
        const analysis: ExamResult['questionAnalysis'] = [];

        questions.forEach(q => {
            const userAns = answers[q.id];
            if (userAns === undefined) {
                skipped++;
                analysis.push('skipped');
            } else if (userAns === q.correctAnswer) {
                correct++;
                analysis.push('correct');
            } else {
                wrong++;
                analysis.push('wrong');
            }
        });

        const score = (correct * 1) - (wrong * 0.25); // Negative marking example

        onFinish({
            score,
            totalQuestions: questions.length,
            correct,
            wrong,
            skipped,
            timeTaken: formatTime(600 - timer),
            questionAnalysis: analysis
        });
    };
    
    const handleGenerateMore = async () => {
        setIsGenerating(true);
        const newQ = await generateQuizQuestion("Physics", "Alternating Current");
        if(newQ) {
            const q: Question = {
                id: questions.length + 1,
                text: newQ.text,
                options: newQ.options,
                correctAnswer: newQ.correctAnswer,
                explanation: newQ.explanation
            };
            setQuestions([...questions, q]);
            setCurrentQuestionIndex(questions.length); 
            setSelectedOption(null);
        }
        setIsGenerating(false);
    }

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className="bg-white min-h-screen flex flex-col max-w-md mx-auto relative">
             {/* Top Bar */}
             <div className="bg-white p-3 shadow-sm border-b flex justify-between items-center sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <Pause size={20} className="text-gray-700" />
                    <span className="text-gray-700 font-medium">Pause</span>
                </div>
                <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-3 py-1 rounded-full">
                    <RefreshCw size={16} className={timer < 60 ? 'animate-spin' : ''} />
                    {formatTime(timer)}
                </div>
                <button 
                    onClick={handleSubmit}
                    className="bg-emerald-500 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-emerald-600"
                >
                    SUBMIT
                </button>
             </div>

             {/* Header */}
             <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                 <h2 className="text-sm font-medium text-gray-600 truncate max-w-[200px]">Alternating Current Test - 85</h2>
                 <div className="grid grid-cols-3 gap-1">
                     <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
                 </div>
             </div>

             {/* Question Area */}
             <div className="flex-1 p-5 overflow-y-auto pb-24">
                 <div className="flex justify-between items-center mb-4">
                     <span className="font-bold text-gray-700">Question {currentQuestionIndex + 1}/{questions.length}</span>
                     <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-500 font-mono">1.0/ -0.25</span>
                 </div>

                 <p className="text-gray-800 text-base leading-relaxed mb-8">
                     {currentQ.text}
                 </p>

                 <div className="space-y-3">
                     {currentQ.options.map((opt, idx) => (
                         <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4
                            ${selectedOption === idx 
                                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                         >
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border
                                 ${selectedOption === idx ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-500 border-gray-300'}`}>
                                 {String.fromCharCode(65 + idx)}
                             </div>
                             <span className="text-gray-700 font-medium">{opt}</span>
                         </button>
                     ))}
                 </div>
                 
                 {/* AI Generator Button */}
                 {currentQuestionIndex === questions.length - 1 && (
                     <div className="mt-8 text-center">
                         <button 
                            onClick={handleGenerateMore}
                            disabled={isGenerating}
                            className="text-sm text-purple-600 flex items-center justify-center gap-2 mx-auto hover:bg-purple-50 px-4 py-2 rounded-full transition"
                         >
                            <Lightbulb size={16} />
                            {isGenerating ? 'Gemini is Thinking...' : 'Generate AI Question'}
                         </button>
                     </div>
                 )}
             </div>

             {/* Navigation */}
             <div className="fixed bottom-0 max-w-md w-full bg-white p-4 border-t shadow-lg flex justify-between items-center z-20">
                 <button 
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border ${currentQuestionIndex === 0 ? 'text-gray-300 border-gray-200' : 'text-orange-500 border-orange-500 hover:bg-orange-50'}`}
                 >
                     <ArrowRight size={20} className="rotate-180" />
                 </button>

                 <button 
                    onClick={() => { setSelectedOption(null); setAnswers(prev => { const n = {...prev}; delete n[currentQ.id]; return n; }) }}
                    className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-100"
                 >
                     Clear Selection
                 </button>

                 <button 
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1}
                     className={`w-10 h-10 rounded-full flex items-center justify-center border ${currentQuestionIndex === questions.length - 1 ? 'text-gray-300 border-gray-200' : 'text-orange-500 border-orange-500 bg-orange-500 text-white'}`}
                 >
                     <ArrowRight size={20} />
                 </button>
             </div>
        </div>
    );
};

// 4. Practice Quiz Generator Component (NEW)
const PracticeQuizGenerator = ({ selectedClass, onBack }: { selectedClass: string, onBack: () => void }) => {
    const syllabus = SYLLABUS_DATA[selectedClass] || SYLLABUS_DATA['12'];
    const [selectedSubject, setSelectedSubject] = useState(syllabus[0]?.subject || '');
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
    
    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setQuizQuestions([]);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setShowExplanation(false);

        const questions = await generatePracticeSet(selectedClass, selectedSubject, topic);
        if (questions && questions.length > 0) {
            setQuizQuestions(questions);
        }
        setIsGenerating(false);
    };

    const handleOptionSelect = (index: number) => {
        if (showExplanation) return; // Prevent changing after revealing
        setSelectedOption(index);
    };

    const handleSubmitAnswer = () => {
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        }
    };

    return (
        <div className="bg-white min-h-screen max-w-md mx-auto relative flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b bg-white z-10 sticky top-0 shadow-sm">
                <button onClick={onBack}><ChevronLeft size={24} className="text-gray-700" /></button>
                <h1 className="font-bold text-gray-800 text-lg">AI Practice Quiz (Class {selectedClass})</h1>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50">
                {quizQuestions.length === 0 ? (
                    // Configuration Screen
                    <div className="p-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Sparkles size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Generate Practice Set</h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Create a custom AI-powered quiz to test your knowledge on any topic.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Subject</label>
                                <select 
                                    value={selectedSubject} 
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    {syllabus.map(s => <option key={s.subject} value={s.subject}>{s.subject}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Topic / Chapter</label>
                                <input 
                                    type="text" 
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g. Thermodynamics, Algebra..." 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating || !topic}
                                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md
                                    ${isGenerating || !topic 
                                        ? 'bg-gray-300 cursor-not-allowed' 
                                        : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg'}`}
                            >
                                {isGenerating ? <RefreshCw className="animate-spin" /> : <PlayCircle />}
                                {isGenerating ? 'Creating Quiz...' : 'Start Practice Quiz'}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Quiz Interface
                    <div className="p-5 pb-24">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-gray-400 text-sm">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">AI Generated</span>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                            <p className="text-gray-800 font-medium text-lg leading-relaxed mb-6">
                                {quizQuestions[currentQuestionIndex].text}
                            </p>

                            <div className="space-y-3">
                                {quizQuestions[currentQuestionIndex].options.map((option: string, idx: number) => {
                                    const isSelected = selectedOption === idx;
                                    const isCorrect = quizQuestions[currentQuestionIndex].correctAnswer === idx;
                                    
                                    let borderClass = 'border-gray-200';
                                    let bgClass = 'bg-white';
                                    let textClass = 'text-gray-700';

                                    if (showExplanation) {
                                        if (isCorrect) {
                                            borderClass = 'border-green-500';
                                            bgClass = 'bg-green-50';
                                            textClass = 'text-green-800';
                                        } else if (isSelected && !isCorrect) {
                                            borderClass = 'border-red-500';
                                            bgClass = 'bg-red-50';
                                            textClass = 'text-red-800';
                                        }
                                    } else if (isSelected) {
                                        borderClass = 'border-purple-500';
                                        bgClass = 'bg-purple-50';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleOptionSelect(idx)}
                                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${borderClass} ${bgClass}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${isSelected || (showExplanation && isCorrect) ? 'border-transparent bg-current' : 'border-gray-300'}`}>
                                                {(isSelected || (showExplanation && isCorrect)) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                            </div>
                                            <span className={`font-medium ${textClass}`}>{option}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {showExplanation && (
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 animate-in slide-in-from-bottom-2">
                                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                    <HelpCircle size={18} /> Explanation
                                </h4>
                                <p className="text-blue-800 text-sm leading-relaxed">
                                    {quizQuestions[currentQuestionIndex].explanation}
                                </p>
                            </div>
                        )}
                        
                        {/* Footer Controls */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 max-w-md mx-auto z-20">
                            {!showExplanation ? (
                                <button 
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedOption === null}
                                    className={`w-full py-3 rounded-xl font-bold transition-all
                                        ${selectedOption !== null
                                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                            : 'bg-gray-100 text-gray-400'}`}
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button 
                                    onClick={handleNextQuestion}
                                    className="w-full py-3 rounded-xl font-bold bg-gray-800 text-white hover:bg-gray-900 transition-all"
                                >
                                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... [Existing Result, PDFReader, SyllabusViewer, NotesGenerator, UpdatesPage, NotificationsPage, ProfilePage, SamplePaperList, LeaderboardPage, BookmarksPage components remain unchanged] ...
// Re-inserting them below to ensure full file integrity.

// 5. Result Component
const Result = ({ result, onHome, onOpenLeaderboard }: { result: ExamResult, onHome: () => void, onOpenLeaderboard: () => void }) => {
    return (
        <div className="bg-blue-500 min-h-screen max-w-md mx-auto relative flex flex-col">
            <div className="p-4 pt-6 text-center">
                <h1 className="text-white font-bold text-xl mb-6">Real-Time Results, Effortless Mastery!</h1>
            </div>

            <div className="bg-gray-50 flex-1 rounded-t-[2rem] p-6 shadow-2xl mt-4">
                <div className="flex justify-between items-start mb-6">
                    <button onClick={onHome}><X className="text-gray-400" /></button>
                    <Share2 className="text-green-500" />
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center -mt-16 mb-6">
                    <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden">
                        <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <h2 className="mt-2 font-bold text-lg text-gray-800">Student Name</h2>
                    <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded mt-1">Alternating Current Test - 85</p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                        <p className="text-gray-400 text-sm mb-1">Score</p>
                        <p className="text-3xl font-bold text-emerald-500">{result.score.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400">Out of {result.totalQuestions}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                        <p className="text-gray-400 text-sm mb-1">Rank</p>
                        <p className="text-3xl font-bold text-blue-600">1952</p>
                        <p className="text-[10px] text-gray-400">Out of 3046</p>
                    </div>
                </div>

                 <div className="text-center text-xs text-gray-500 mb-6 bg-blue-50 py-2 rounded-lg">
                    ⏱️ Time Taken: {result.timeTaken}
                </div>

                <button 
                    onClick={onOpenLeaderboard}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-200 mb-8 flex items-center justify-center gap-2 hover:bg-blue-600 transition"
                >
                    <Trophy size={18} />
                    LEADERBOARD
                </button>

                {/* Question Analysis Grid */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4 text-center">Question Analysis</h3>
                    <div className="flex justify-center gap-4 mb-4 text-[10px]">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Correct - {result.correct}</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Wrong - {result.wrong}</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Skipped - {result.skipped}</div>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3">
                        {result.questionAnalysis.map((status, i) => (
                             <div 
                                key={i}
                                className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm
                                ${status === 'correct' ? 'bg-emerald-100 text-emerald-600' : ''}
                                ${status === 'wrong' ? 'bg-red-100 text-red-600' : ''}
                                ${status === 'skipped' ? 'bg-yellow-50 text-yellow-600' : ''}
                                `}
                             >
                                 {i + 1}
                             </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                     <button className="py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold" onClick={onHome}>
                         Home
                     </button>
                     <button className="py-3 bg-emerald-500 text-white rounded-lg font-semibold">
                         Solution
                     </button>
                </div>
            </div>
        </div>
    );
};

// 6. PDF Reader Component
const PDFReader = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="bg-white min-h-screen max-w-md mx-auto relative flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-white z-10 sticky top-0">
                <button onClick={onBack}><ChevronLeft size={24} className="text-gray-700" /></button>
                <h1 className="font-medium text-gray-800">Relations and Functions</h1>
                <div className="flex gap-4">
                    <Download size={20} className="text-gray-600" />
                    <MoreVertical size={20} className="text-gray-600" />
                </div>
            </div>

            <div className="flex-1 bg-gray-100 overflow-y-auto p-2">
                {/* Mock PDF Page */}
                <div className="bg-white shadow-md min-h-[800px] w-full p-8 mb-4">
                    <div className="border-2 border-emerald-400 rounded-lg p-2 mb-8 inline-block">
                        <h2 className="text-emerald-500 font-serif font-bold text-xl uppercase">Chapter 1</h2>
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-cyan-600 mb-6 border-b-2 border-cyan-100 pb-2">RELATIONS AND FUNCTIONS</h1>
                    
                    <div className="prose prose-sm max-w-none text-justify font-serif text-gray-800">
                        <p className="mb-4 text-xs italic text-gray-500">
                            ❖ There is no permanent place in the world for ugly mathematics... It may be very hard to define mathematical beauty but that is just as true of beauty of any kind, we may not know quite what we mean by a beautiful poem, but that does not prevent us from recognising one when we read it. — G. H. HARDY
                        </p>
                        
                        <p>
                            1.1 Introduction<br/>
                            Recall that the notion of relations and functions, domain, co-domain and range have been introduced in Class XI along with different types of specific real valued functions and their graphs...
                        </p>
                        
                         <div className="my-6 p-4 bg-blue-50 border-l-4 border-blue-500">
                            <h4 className="font-bold text-blue-800">Lejeune Dirichlet (1805-1859)</h4>
                            <p className="text-sm">German mathematician credited with the modern formal definition of a function.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* PDF Toolbar */}
            <div className="fixed bottom-0 max-w-md w-full bg-white border-t p-3 flex justify-around items-center z-20">
                 <button className="p-2 text-gray-500 hover:text-blue-500"><Menu size={20} /></button>
                 <div className="flex items-center gap-4">
                     <button className="p-2 bg-red-100 text-red-500 rounded-full"><PenTool size={18} /></button>
                     <button className="p-2 text-gray-500 hover:text-blue-500"><Eraser size={20} /></button>
                     <button className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center border-2 border-gray-200"></button>
                     <button className="p-2 text-gray-500 hover:text-blue-500"><MoreVertical size={20} /></button>
                 </div>
            </div>
        </div>
    );
};

// 7. Syllabus Viewer Component
const SyllabusViewer = ({ selectedClass, onBack, onOpenNotes }: { selectedClass: string, onBack: () => void, onOpenNotes: (subject: string, topic: string) => void }) => {
    const data = SYLLABUS_DATA[selectedClass] || SYLLABUS_DATA['12']; // Fallback
    const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
    const [summaryModal, setSummaryModal] = useState<{ isOpen: boolean, subject: string, chapter: string } | null>(null);
    const [summaryData, setSummaryData] = useState<{ summary: string, keyConcepts: {term: string, definition: string}[] } | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [selectedConcept, setSelectedConcept] = useState<{term: string, definition: string} | null>(null);

    const handleChapterClick = async (subject: string, chapter: string) => {
        setSummaryModal({ isOpen: true, subject, chapter });
        setLoadingSummary(true);
        setSummaryData(null);
        setSelectedConcept(null);
        
        // Fetch AI Summary
        const result = await generateChapterSummary(selectedClass, subject, chapter);
        if (result) {
            setSummaryData(result);
        }
        setLoadingSummary(false);
    };

    return (
        <div className="bg-white min-h-screen max-w-md mx-auto relative flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b bg-white z-10 sticky top-0 shadow-sm">
                <button onClick={onBack}><ChevronLeft size={24} className="text-gray-700" /></button>
                <h1 className="font-bold text-gray-800 text-lg">Class {selectedClass} Syllabus</h1>
            </div>
            
            <div className="p-4 space-y-3 bg-gray-50 flex-1 overflow-y-auto">
                <div className="bg-blue-100 p-4 rounded-xl mb-4 border border-blue-200">
                    <h2 className="text-blue-800 font-bold flex items-center gap-2">
                        <BookOpen size={20}/>
                        Latest Curriculum 2025-26
                    </h2>
                    <p className="text-blue-600 text-xs mt-1">
                        Tap on a chapter to get an AI-powered instant summary and key concepts.
                    </p>
                </div>

                {data.map((subject) => (
                    <div key={subject.subject} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button 
                            onClick={() => setExpandedSubject(expandedSubject === subject.subject ? null : subject.subject)}
                            className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-8 rounded-full ${expandedSubject === subject.subject ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                                <span className="font-bold text-gray-700">{subject.subject}</span>
                            </div>
                            <ChevronLeft size={20} className={`text-gray-400 transition-transform duration-300 ${expandedSubject === subject.subject ? '-rotate-90' : 'rotate-180'}`} />
                        </button>
                        
                        {expandedSubject === subject.subject && (
                            <div className="bg-gray-50 px-4 pb-4 pt-2 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                <ul className="space-y-2">
                                    {subject.chapters.map((chapter, idx) => (
                                        <li key={idx}>
                                            <button 
                                                onClick={() => handleChapterClick(subject.subject, chapter)}
                                                className="w-full text-left text-sm text-gray-600 flex items-start gap-2 bg-white p-2 rounded border border-gray-100 hover:border-blue-300 hover:shadow-sm transition-all group"
                                            >
                                                <span className="text-xs font-mono text-gray-400 mt-0.5 group-hover:text-blue-500">{String(idx + 1).padStart(2, '0')}</span>
                                                <span className="flex-1">{chapter}</span>
                                                <Sparkles size={14} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Summary Modal */}
            {summaryModal && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
                        {/* Modal Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <div>
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">{summaryModal.subject}</p>
                                <h2 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1 pr-4">{summaryModal.chapter}</h2>
                            </div>
                            <button onClick={() => setSummaryModal(null)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {loadingSummary ? (
                                <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                                    <Sparkles className="text-purple-500 animate-spin" size={40} />
                                    <p className="text-gray-500 font-medium">Analyzing chapter content...</p>
                                </div>
                            ) : summaryData ? (
                                <>
                                    {/* Summary Section */}
                                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                        <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                                            <BookOpen size={18} /> Chapter Overview
                                        </h3>
                                        <p className="text-indigo-800 text-sm leading-relaxed">
                                            {summaryData.summary}
                                        </p>
                                    </div>

                                    {/* Concepts Section */}
                                    <div>
                                        <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
                                            <Lightbulb size={18} className="text-yellow-500" /> Key Concepts
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {summaryData.keyConcepts.map((concept, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedConcept(concept)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all
                                                        ${selectedConcept?.term === concept.term 
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'}`}
                                                >
                                                    {concept.term}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Concept Detail Card */}
                                    {selectedConcept && (
                                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg animate-in zoom-in-95 duration-200">
                                            <h4 className="font-bold text-gray-800 text-lg mb-2">{selectedConcept.term}</h4>
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{selectedConcept.definition}</p>
                                            
                                            <button 
                                                onClick={() => {
                                                    setSummaryModal(null);
                                                    onOpenNotes(summaryModal.subject, selectedConcept.term);
                                                }}
                                                className="w-full bg-blue-100 text-blue-700 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-200 transition-colors"
                                            >
                                                <Sparkles size={16} />
                                                Generate Full AI Notes
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-red-500">Failed to load summary.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// 8. Notes Generator Component
const NotesGenerator = ({ selectedClass, onBack, initialSubject, initialTopic }: { 
    selectedClass: string, 
    onBack: () => void,
    initialSubject?: string,
    initialTopic?: string
}) => {
    const syllabus = SYLLABUS_DATA[selectedClass] || SYLLABUS_DATA['12'];
    const [selectedSubject, setSelectedSubject] = useState(initialSubject || syllabus[0]?.subject || '');
    const [topic, setTopic] = useState(initialTopic || '');
    const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Auto-generate if initial props are provided
    useEffect(() => {
        if (initialSubject && initialTopic) {
             handleGenerate();
        }
    }, []);

    const handleGenerate = async () => {
        if(!topic.trim()) return;
        setIsLoading(true);
        setGeneratedNotes(null);
        const notes = await generateStudyNotes(selectedClass, selectedSubject, topic);
        setGeneratedNotes(notes);
        setIsLoading(false);
    };

    const handleCopy = () => {
        if(generatedNotes) {
            navigator.clipboard.writeText(generatedNotes);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    }

    return (
        <div className="bg-white min-h-screen max-w-md mx-auto relative flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b bg-white z-10 sticky top-0 shadow-sm">
                <button onClick={onBack}><ChevronLeft size={24} className="text-gray-700" /></button>
                <h1 className="font-bold text-gray-800 text-lg">AI Smart Notes (Class {selectedClass})</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {/* Controls */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Subject</label>
                        <select 
                            value={selectedSubject} 
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {syllabus.map(s => <option key={s.subject} value={s.subject}>{s.subject}</option>)}
                        </select>
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Topic / Chapter</label>
                         <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. Electric Charges" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Action Buttons Row */}
                    <div className="flex gap-2">
                        <button 
                            onClick={handleGenerate}
                            disabled={isLoading || !topic}
                            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all
                                ${isLoading || !topic ? 'bg-gray-300' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg'}`}
                        >
                            {isLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                            {isLoading ? 'Generating...' : 'Generate Notes'}
                        </button>
                    </div>
                </div>

                {/* Output Area */}
                {generatedNotes && (
                    <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-indigo-50 p-3 border-b border-indigo-100 flex justify-between items-center">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                                <BookOpen size={16} />
                                {topic}
                            </h3>
                            <button onClick={handleCopy} className="text-indigo-600 hover:bg-indigo-100 p-1.5 rounded-full transition-colors">
                                {isCopied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                        <div className="p-6 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {generatedNotes}
                        </div>
                    </div>
                )}

                {!generatedNotes && !isLoading && (
                    <div className="text-center py-10 opacity-50">
                        <Sparkles size={48} className="mx-auto mb-4 text-blue-300" />
                        <p className="text-gray-500">Enter a topic to generate instant study notes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// 9. Updates Page Component
const UpdatesPage = () => {
    return (
        <div className="bg-white min-h-screen pb-20">
             <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
                 <h1 className="text-xl font-bold">Latest Updates</h1>
                 <p className="text-blue-100 text-xs mt-1">Stay informed about your exams</p>
             </div>
             <div className="p-4 space-y-4">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                         <div className="flex items-center gap-2 mb-2">
                             <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Important</span>
                             <span className="text-gray-400 text-xs">2 hours ago</span>
                         </div>
                         <h3 className="font-bold text-gray-800 mb-1">CBSE Class 12 Date Sheet Released</h3>
                         <p className="text-gray-600 text-sm leading-snug">
                             The Central Board of Secondary Education has released the official date sheet for the 2025 board examinations. Check the app for details.
                         </p>
                     </div>
                 ))}
                 <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                             <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">App Update</span>
                             <span className="text-gray-400 text-xs">Yesterday</span>
                         </div>
                         <h3 className="font-bold text-gray-800 mb-1">New AI Features Added!</h3>
                         <p className="text-gray-600 text-sm leading-snug">
                             We have added AI-powered notes generation and question explanations. Try them out now!
                         </p>
                 </div>
             </div>
        </div>
    );
};

// 10. Notifications Page Component
const NotificationsPage = ({ reminders }: { reminders: Reminder[] }) => {
    return (
        <div className="bg-white min-h-screen pb-20">
             <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
                 <h1 className="text-xl font-bold">Notifications</h1>
             </div>
             <div className="divide-y divide-gray-100">
                {/* Reminders Section */}
                {reminders.length > 0 && (
                     <div className="p-4 bg-orange-50 border-b border-orange-100">
                        <h2 className="text-sm font-bold text-orange-700 mb-3 flex items-center gap-2">
                            <AlarmClock size={16} />
                            Upcoming Study Reminders
                        </h2>
                        <div className="space-y-3">
                            {reminders.map((rem) => (
                                <div key={rem.id} className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{rem.topic}</h4>
                                            <p className="text-xs text-gray-500">{rem.subject}</p>
                                        </div>
                                        <div className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded">
                                            {new Date(rem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                                        <Calendar size={10} />
                                        {new Date(rem.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}

                 {[1, 2, 3, 4].map((i) => (
                     <div key={i} className={`p-4 flex gap-3 ${i === 1 ? 'bg-blue-50/50' : 'bg-white'}`}>
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${i === 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                             <Bell size={20} />
                         </div>
                         <div>
                             <h4 className="font-semibold text-gray-800 text-sm">Mock Test Result Available</h4>
                             <p className="text-gray-500 text-xs mt-0.5">You scored 8/10 in Physics Chapter 1 Test. Tap to view detailed analysis.</p>
                             <span className="text-gray-400 text-[10px] mt-2 block">10:30 AM</span>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
};

// 11. Profile Page Component
const ProfilePage = ({ 
    userPrefs, 
    userProfile,
    onEditPrefs,
    onUpdateProfile
}: { 
    userPrefs: UserPrefs, 
    userProfile: UserProfileData,
    onEditPrefs: () => void,
    onUpdateProfile: (data: UserProfileData) => void
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(userProfile.name);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!tempName.trim()) {
            setError("Name cannot be empty");
            return;
        }
        onUpdateProfile({ ...userProfile, name: tempName.trim() });
        setIsEditing(false);
        setError(null);
    };

    const handleCancel = () => {
        setTempName(userProfile.name);
        setIsEditing(false);
        setError(null);
    }

    return (
        <div className="bg-white min-h-screen pb-20">
             <div className="bg-blue-600 text-white p-6 pt-10 rounded-b-[2rem] shadow-lg relative">
                 <div className="flex items-center gap-4">
                     <div className="relative">
                        <div className="w-16 h-16 bg-white rounded-full p-1 overflow-hidden">
                            <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        </div>
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                <PenTool size={12} className="text-white"/>
                            </div>
                        )}
                     </div>
                     
                     <div className="flex-1">
                         {isEditing ? (
                             <div className="relative">
                                 <input 
                                    value={tempName}
                                    onChange={(e) => {
                                        setTempName(e.target.value);
                                        if (e.target.value.trim()) setError(null);
                                    }}
                                    className={`text-gray-900 text-lg font-bold rounded px-2 py-1 w-full outline-none focus:ring-2 ${error ? 'ring-2 ring-red-400 bg-red-50' : 'focus:ring-blue-300'}`}
                                    autoFocus
                                    placeholder="Enter Name"
                                 />
                                 {error && (
                                    <div className="absolute top-full left-0 mt-1 bg-red-500 text-white text-[10px] px-2 py-1 rounded shadow-sm z-10 animate-in fade-in slide-in-from-top-1">
                                        {error}
                                    </div>
                                 )}
                             </div>
                         ) : (
                            <h1 className="text-xl font-bold">{userProfile.name}</h1>
                         )}
                         <p className="text-blue-100 text-sm">Class {userPrefs.classes.join(', ')} Student</p>
                     </div>
                 </div>
                 
                 <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                    className={`absolute top-6 right-6 p-2 rounded-full transition ${isEditing ? 'bg-emerald-400 text-white hover:bg-emerald-500' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                 >
                     {isEditing ? <Check size={20} /> : <PenTool size={20} />}
                 </button>
                 {isEditing && (
                     <button 
                        onClick={handleCancel}
                        className="absolute top-6 right-16 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
                     >
                         <X size={20} />
                     </button>
                 )}
             </div>

             <div className="p-4 space-y-4 mt-2">
                 <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
                     <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                         <BookOpen size={18} className="text-blue-500"/>
                         My Study Preferences
                     </h3>
                     <div className="space-y-3">
                         <div className="flex justify-between items-center py-2 border-b border-gray-50">
                             <span className="text-gray-500 text-sm">Classes</span>
                             <span className="font-medium text-gray-800">{userPrefs.classes.join(', ')}</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-gray-50">
                             <span className="text-gray-500 text-sm">Board</span>
                             <span className="font-medium text-gray-800">{userPrefs.boards.join(', ')}</span>
                         </div>
                         <div className="flex justify-between items-center py-2">
                             <span className="text-gray-500 text-sm">Exams</span>
                             <span className="font-medium text-gray-800">{userPrefs.exams.length > 0 ? userPrefs.exams.join(', ') : 'None'}</span>
                         </div>
                     </div>
                     <button onClick={onEditPrefs} className="w-full mt-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg text-sm hover:bg-blue-100 transition">
                         Edit Preferences
                     </button>
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                         <div className="bg-orange-100 w-8 h-8 rounded-lg flex items-center justify-center text-orange-600 mb-2"><Trophy size={18}/></div>
                         <h4 className="font-bold text-gray-800">12</h4>
                         <p className="text-xs text-gray-500">Tests Attempted</p>
                     </div>
                     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                         <div className="bg-emerald-100 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 mb-2"><Calendar size={18}/></div>
                         <h4 className="font-bold text-gray-800">15</h4>
                         <p className="text-xs text-gray-500">Days Streak</p>
                     </div>
                 </div>

                 <button className="w-full py-3 flex items-center justify-center gap-2 text-red-500 font-medium hover:bg-red-50 rounded-xl transition">
                     <LogOut size={20} />
                     Logout
                 </button>
             </div>
        </div>
    );
};

// 12. Sample Paper List Component
const SamplePaperList = ({ selectedClass, onBack }: { selectedClass: string, onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState<'ENGLISH' | 'HINDI'>('ENGLISH');

    const papers = [
        { id: 1, subject: 'Computer Applications', views: '12.14K', color: 'border-l-emerald-400' },
        { id: 2, subject: 'Hindi', views: '88.72K', color: 'border-l-teal-500' },
        { id: 3, subject: 'English', views: '144.08K', color: 'border-l-cyan-600' },
        { id: 4, subject: 'Social Science', views: '143.4K', color: 'border-l-yellow-400' },
        { id: 5, subject: 'Science', views: '259.8K', color: 'border-l-teal-600' },
        { id: 6, subject: 'Mathematics', views: '348.12K', color: 'border-l-pink-500' },
    ];

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col max-w-md mx-auto relative">
             <div className="bg-blue-500 pt-4 px-4 pb-0 text-white shadow-md z-10 sticky top-0">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack}><ArrowRight className="rotate-180" size={24} /></button>
                        <h1 className="text-xl font-serif italic tracking-wide">Sample Paper</h1>
                    </div>
                    <div className="flex gap-4">
                        <Search size={20} />
                        <Download size={20} className="border-2 border-white rounded p-0.5 box-content" />
                    </div>
                </div>
                
                <div className="flex text-sm font-bold uppercase tracking-wider">
                    <button 
                        onClick={() => setActiveTab('ENGLISH')}
                        className={`flex-1 pb-3 border-b-[3px] transition-colors text-center ${activeTab === 'ENGLISH' ? 'border-white text-white' : 'border-transparent text-blue-200'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setActiveTab('HINDI')}
                        className={`flex-1 pb-3 border-b-[3px] transition-colors text-center ${activeTab === 'HINDI' ? 'border-white text-white' : 'border-transparent text-blue-200'}`}
                    >
                        Hindi
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-3 pb-20">
                {papers.map((paper) => (
                    <div key={paper.id} className={`bg-white p-5 rounded-lg shadow-sm flex justify-between items-center border-l-[6px] ${paper.color}`}>
                        <div className="font-bold text-gray-700 italic text-sm">
                            {paper.id} - {paper.subject}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                            <Eye size={16} />
                            {paper.views}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 13. Leaderboard Component
const LeaderboardPage = ({ userProfile, onBack }: { userProfile: UserProfileData, onBack: () => void }) => {
    // Mock Data
    const leaders = [
        { rank: 1, name: 'Anjali Gupta', score: 980, avatar: 'https://i.pravatar.cc/150?u=a' },
        { rank: 2, name: 'Rahul Kumar', score: 965, avatar: 'https://i.pravatar.cc/150?u=b' },
        { rank: 3, name: 'Sneha Singh', score: 940, avatar: 'https://i.pravatar.cc/150?u=c' },
        { rank: 4, name: 'Vikram Patel', score: 920, avatar: 'https://i.pravatar.cc/150?u=d' },
        { rank: 5, name: 'Priya Sharma', score: 915, avatar: 'https://i.pravatar.cc/150?u=e' },
        { rank: 6, name: 'Amit Verma', score: 890, avatar: 'https://i.pravatar.cc/150?u=f' },
        { rank: 7, name: 'Rohan Das', score: 885, avatar: 'https://i.pravatar.cc/150?u=g' },
        { rank: 8, name: 'Kavita Roy', score: 870, avatar: 'https://i.pravatar.cc/150?u=h' },
    ];
    
    // Determine user's mock rank
    const userRank = 1952;
    const userScore = 750;

    return (
        <div className="bg-blue-50 min-h-screen flex flex-col max-w-md mx-auto relative pb-20">
            {/* Header */}
             <div className="bg-blue-600 p-4 text-white shadow-md sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={onBack}><ArrowRight className="rotate-180" size={24} /></button>
                    <h1 className="text-xl font-bold">Leaderboard</h1>
                </div>
                <div className="flex bg-blue-700/50 p-1 rounded-lg">
                    <button className="flex-1 py-1.5 text-xs font-bold text-center bg-white text-blue-600 rounded shadow-sm">Weekly</button>
                    <button className="flex-1 py-1.5 text-xs font-bold text-center text-blue-100">All Time</button>
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="bg-blue-600 pb-10 rounded-b-[2rem] px-6">
                <div className="flex justify-center items-end gap-4 mt-6">
                     {/* Rank 2 */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                                <img src={leaders[1].avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-300 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">#2</div>
                        </div>
                        <p className="text-white text-xs font-bold mt-3 text-center w-20 truncate">{leaders[1].name}</p>
                        <p className="text-blue-200 text-xs">{leaders[1].score} pts</p>
                    </div>

                    {/* Rank 1 */}
                    <div className="flex flex-col items-center -mt-6">
                        <div className="relative">
                            <Crown size={24} className="text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2" fill="currentColor" />
                            <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden shadow-lg">
                                <img src={leaders[0].avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full border border-white">#1</div>
                        </div>
                        <p className="text-white text-sm font-bold mt-4 text-center w-24 truncate">{leaders[0].name}</p>
                        <p className="text-blue-200 text-xs">{leaders[0].score} pts</p>
                    </div>

                    {/* Rank 3 */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                                <img src={leaders[2].avatar} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-300 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">#3</div>
                        </div>
                        <p className="text-white text-xs font-bold mt-3 text-center w-20 truncate">{leaders[2].name}</p>
                        <p className="text-blue-200 text-xs">{leaders[2].score} pts</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 p-4 -mt-4 space-y-3">
                {leaders.slice(3).map((l) => (
                    <div key={l.rank} className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-400 text-sm w-6">{l.rank}</span>
                            <img src={l.avatar} className="w-10 h-10 rounded-full bg-gray-200" alt="" />
                            <span className="font-bold text-gray-700 text-sm">{l.name}</span>
                        </div>
                        <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2 py-1 rounded">{l.score}</span>
                    </div>
                ))}
            </div>

            {/* Sticky User Rank */}
            <div className="fixed bottom-0 max-w-md w-full bg-white border-t p-3 shadow-lg z-20">
                <div className="bg-blue-600 text-white p-3 rounded-xl flex items-center justify-between shadow-md">
                     <div className="flex items-center gap-3">
                            <span className="font-bold text-blue-200 text-sm w-8">#{userRank}</span>
                            <div className="w-10 h-10 rounded-full bg-white/20 p-0.5">
                                 <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                            </div>
                            <span className="font-bold text-white text-sm">You</span>
                        </div>
                        <span className="text-white font-bold text-sm bg-white/20 px-2 py-1 rounded">{userScore} pts</span>
                </div>
            </div>
        </div>
    );
};

// 14. Bookmarks Page Component
const BookmarksPage = ({ category, onBack }: { category: BookmarkCategory, onBack: () => void }) => {
    
    // Internal Mock Data for this component
    const [items, setItems] = useState(() => {
        if (category === 'QUESTIONS') {
             return [
                { id: 1, title: "An A.C. circuit consists of a resistance and a choke...", subtitle: "Physics - AC", date: "2 days ago" },
                { id: 2, title: "Which of the following is the unit of electric flux?", subtitle: "Physics - Electrostatics", date: "5 days ago" }
            ];
        } else if (category === 'BOOKS') {
            return [
                { id: 1, title: "NCERT Physics Part 1", subtitle: "Class 12 - 12 MB", date: "Downloaded on 12 Oct" },
                { id: 2, title: "NCERT Chemistry Part 2", subtitle: "Class 12 - 15 MB", date: "Downloaded on 10 Oct" }
            ];
        } else if (category === 'PDFS') {
            return [
                { id: 1, title: "Electric Charges Notes", subtitle: "Chapter 1 - Physics", date: "Saved yesterday" },
                { id: 2, title: "Integration Formulas", subtitle: "Mathematics", date: "Saved last week" }
            ];
        } else {
             return [
                { id: 1, title: "5 Tips to Crack JEE Advanced", subtitle: "Exam Strategy", date: "5 min read" },
                { id: 2, title: "How to manage time during boards", subtitle: "Tips & Tricks", date: "3 min read" }
            ];
        }
    });

    const getIcon = () => {
        switch(category) {
            case 'QUESTIONS': return <FileQuestion className="text-blue-500" />;
            case 'BOOKS': return <BookOpen className="text-emerald-500" />;
            case 'PDFS': return <FileText className="text-red-500" />;
            case 'ARTICLES': return <Bookmark className="text-yellow-500" />;
        }
    }

    const getTitle = () => {
        switch(category) {
            case 'QUESTIONS': return "Bookmarked Questions";
            case 'BOOKS': return "Downloaded Books";
            case 'PDFS': return "Saved PDFs";
            case 'ARTICLES': return "Saved Articles";
        }
    }

    const handleDelete = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    }

    return (
        <div className="bg-white min-h-screen flex flex-col max-w-md mx-auto relative pb-20">
             <div className="bg-white p-4 border-b flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={onBack}><ArrowRight className="rotate-180 text-gray-700" size={24} /></button>
                <h1 className="text-lg font-bold text-gray-800">{getTitle()}</h1>
            </div>

            <div className="p-4 space-y-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                            {getIcon()}
                        </div>
                        <p>No items found in this section.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg shrink-0">
                                {getIcon()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 truncate">{item.title}</h3>
                                <p className="text-xs text-gray-500 mb-2">{item.subtitle}</p>
                                <p className="text-[10px] text-gray-400">{item.date}</p>
                            </div>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const App = () => {
  const [activePage, setActivePage] = useState<PageState>(PageState.ONBOARDING);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  
  // State for user preferences
  const [userPrefs, setUserPrefs] = useState<UserPrefs>({
      classes: ['12'],
      boards: ['CBSE'],
      exams: []
  });

  const [userProfile, setUserProfile] = useState<UserProfileData>({
      name: 'Sunil Lambat',
      avatar: 'https://picsum.photos/200'
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for Reminders
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Track the view class from Home to pass to Syllabus
  const [selectedClassForResource, setSelectedClassForResource] = useState<string>('12');

  // Track active Bookmark Category
  const [bookmarkCategory, setBookmarkCategory] = useState<BookmarkCategory>('QUESTIONS');

  // Deep linking for AI Notes
  const [aiNotesParams, setAiNotesParams] = useState<{subject: string, topic: string} | null>(null);

  // Notification Permission Logic
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
  }, []);

  // Check for due reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
        const now = Date.now();
        reminders.forEach(rem => {
            // Check if reminder is due within the last minute (to avoid re-triggering old ones or missing slightly off timing)
            if (rem.timestamp <= now && rem.timestamp > now - 61000) {
                if (Notification.permission === "granted") {
                    new Notification(`Study Time: ${rem.subject}`, {
                        body: `It's time to study ${rem.topic}!`,
                        icon: '/icon.png' // Optional icon path
                    });
                } else {
                    // Fallback alert if permissions denied/not supported
                    alert(`⏰ Reminder: Time to study ${rem.subject} - ${rem.topic}`);
                }
            }
        });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders]);

  const addReminder = (subject: string, topic: string, time: string) => {
      const timestamp = new Date(time).getTime();
      const newReminder: Reminder = {
          id: Date.now().toString(),
          subject,
          topic,
          timestamp,
          dateString: time
      };
      // Add and sort by time
      setReminders(prev => [...prev, newReminder].sort((a, b) => a.timestamp - b.timestamp));
  };

  // Simple routing logic
  const renderContent = () => {
    switch (activePage) {
      case PageState.ONBOARDING:
        return (
            <Onboarding 
                initialPrefs={userPrefs}
                onSave={(prefs) => {
                    setUserPrefs(prefs);
                    setActivePage(PageState.HOME);
                }} 
            />
        );
      case PageState.HOME:
        return (
            <Home 
                userPrefs={userPrefs}
                userProfile={userProfile}
                onStartTest={() => setActivePage(PageState.TEST)} 
                onOpenPDF={() => setActivePage(PageState.PDF)}
                onOpenSyllabus={(cls) => {
                    setSelectedClassForResource(cls);
                    setActivePage(PageState.SYLLABUS);
                }}
                onOpenAINotes={(cls) => {
                    setSelectedClassForResource(cls);
                    setAiNotesParams(null); // Reset params
                    setActivePage(PageState.AI_NOTES);
                }}
                onOpenSamplePaper={(cls) => {
                    setSelectedClassForResource(cls);
                    setActivePage(PageState.SAMPLE_PAPER);
                }}
                onOpenQuiz={(cls) => {
                    setSelectedClassForResource(cls);
                    setActivePage(PageState.AI_QUIZ);
                }}
                onEditPrefs={() => setActivePage(PageState.ONBOARDING)}
                onNavigate={setActivePage}
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                onOpenBookmarks={(cat) => {
                    setBookmarkCategory(cat);
                    setActivePage(PageState.BOOKMARKS);
                }}
            />
        );
      case PageState.UPDATES:
          return <UpdatesPage />;
      case PageState.NOTIFICATION:
          return <NotificationsPage reminders={reminders} />;
      case PageState.PROFILE:
          return (
            <ProfilePage 
                userPrefs={userPrefs} 
                userProfile={userProfile}
                onEditPrefs={() => setActivePage(PageState.ONBOARDING)} 
                onUpdateProfile={setUserProfile}
            />
          );
      case PageState.TEST:
        return (
            <TestInterface 
                onFinish={(result) => {
                    setExamResult(result);
                    setActivePage(PageState.RESULT);
                }} 
            />
        );
      case PageState.RESULT:
         return (
             <Result 
                result={examResult!} 
                onHome={() => setActivePage(PageState.HOME)}
                onOpenLeaderboard={() => setActivePage(PageState.LEADERBOARD)}
             />
         );
      case PageState.PDF:
          return <PDFReader onBack={() => setActivePage(PageState.HOME)} />;
      case PageState.SYLLABUS:
          return (
            <SyllabusViewer 
                selectedClass={selectedClassForResource} 
                onBack={() => setActivePage(PageState.HOME)}
                onOpenNotes={(subject, topic) => {
                    setAiNotesParams({ subject, topic });
                    setActivePage(PageState.AI_NOTES);
                }}
            />
          );
      case PageState.AI_NOTES:
          return (
            <NotesGenerator 
                selectedClass={selectedClassForResource} 
                onBack={() => setActivePage(PageState.HOME)} 
                initialSubject={aiNotesParams?.subject}
                initialTopic={aiNotesParams?.topic}
            />
          );
      case PageState.AI_QUIZ:
            return (
                <PracticeQuizGenerator 
                    selectedClass={selectedClassForResource}
                    onBack={() => setActivePage(PageState.HOME)}
                />
            );
      case PageState.SAMPLE_PAPER:
          return (
             <SamplePaperList 
                selectedClass={selectedClassForResource}
                onBack={() => setActivePage(PageState.HOME)}
             />
          );
      case PageState.LEADERBOARD:
          return <LeaderboardPage userProfile={userProfile} onBack={() => setActivePage(PageState.HOME)} />;
      case PageState.BOOKMARKS:
          return <BookmarksPage category={bookmarkCategory} onBack={() => setActivePage(PageState.HOME)} />;
      default:
        return <div>404</div>;
    }
  };
  
  // Pages that show the bottom nav
  const showBottomNav = [PageState.HOME, PageState.UPDATES, PageState.NOTIFICATION, PageState.PROFILE].includes(activePage);

  return (
    <div className={`font-sans ${isDarkMode ? 'bg-gray-950' : 'bg-gray-100'} min-h-screen flex justify-center`}>
        <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'} min-h-screen shadow-xl overflow-hidden relative`}>
            {renderContent()}
            
            {showBottomNav && (
                <BottomNav activePage={activePage} onNavigate={setActivePage} />
            )}
        </div>
    </div>
  );
};

export default App;
