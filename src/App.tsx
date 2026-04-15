import { useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Header from './components/Header';
import SubjectCard from './components/SubjectCard';
import AddSubjectModal from './components/AddSubjectModal';
import { useSubjects } from './hooks/useSubjects';

const THRESHOLD_KEY = 'attendance_threshold';

function getStoredThreshold(): number {
  const stored = localStorage.getItem(THRESHOLD_KEY);
  return stored ? Number(stored) : 75;
}

export default function App() {
  const [threshold, setThreshold] = useState<number>(getStoredThreshold);
  const [showModal, setShowModal] = useState(false);
  const { subjects, addSubject, updateAttendance, deleteSubject, markClass } = useSubjects();

  const handleThresholdChange = (val: number) => {
    setThreshold(val);
    localStorage.setItem(THRESHOLD_KEY, String(val));
  };

  const overall =
    subjects.length === 0
      ? null
      : {
          total: subjects.reduce((s, x) => s + x.totalClasses, 0),
          attended: subjects.reduce((s, x) => s + x.attendedClasses, 0),
        };

  const overallPct =
    overall && overall.total > 0
      ? ((overall.attended / overall.total) * 100).toFixed(1)
      : null;

  const safeCount = subjects.filter(
    s => s.totalClasses > 0 && (s.attendedClasses / s.totalClasses) * 100 >= threshold
  ).length;

  const atRiskCount = subjects.filter(
    s => s.totalClasses > 0 && (s.attendedClasses / s.totalClasses) * 100 < threshold
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header threshold={threshold} onThresholdChange={handleThresholdChange} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {subjects.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {overallPct !== null ? `${overallPct}%` : '—'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Overall</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{safeCount}</p>
              <p className="text-xs text-emerald-600 mt-0.5">On Track</p>
            </div>
            <div className="bg-red-50 rounded-2xl border border-red-200 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{atRiskCount}</p>
              <p className="text-xs text-red-600 mt-0.5">At Risk</p>
            </div>
          </div>
        )}

        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-10 max-w-sm">
              <BookOpen className="text-blue-400 mx-auto mb-3" size={36} />
              <h2 className="text-lg font-semibold text-gray-800 mb-1">No subjects yet</h2>
              <p className="text-sm text-gray-500 mb-5">
                Add your subjects to start tracking attendance and stay on top of your studies.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus size={16} />
                Add First Subject
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                threshold={threshold}
                onMarkClass={markClass}
                onDelete={deleteSubject}
                onUpdate={updateAttendance}
              />
            ))}
            <button
              onClick={() => setShowModal(true)}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-colors min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="text-sm font-medium">Add Subject</span>
            </button>
          </div>
        )}
      </main>

      {showModal && (
        <AddSubjectModal onAdd={addSubject} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
