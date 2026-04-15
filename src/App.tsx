import { useState } from 'react';

type Subject = {
  id: number;
  name: string;
  totalClasses: number;
  attendedClasses: number;
};

export default function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState('');

  const addSubject = () => {
    if (!name) return;
    setSubjects([
      ...subjects,
      { id: Date.now(), name, totalClasses: 0, attendedClasses: 0 },
    ]);
    setName('');
  };

  const markPresent = (id: number) => {
    setSubjects(subjects.map(s =>
      s.id === id
        ? { ...s, totalClasses: s.totalClasses + 1, attendedClasses: s.attendedClasses + 1 }
        : s
    ));
  };

  const markAbsent = (id: number) => {
    setSubjects(subjects.map(s =>
      s.id === id
        ? { ...s, totalClasses: s.totalClasses + 1 }
        : s
    ));
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">
        Attendance Tracker 🚀
      </h1>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter subject"
        className="border p-2 mr-2"
      />
      <button onClick={addSubject} className="bg-green-500 text-white px-4 py-2">
        Add
      </button>

      <div className="mt-6">
        {subjects.map(s => (
          <div key={s.id} className="border p-4 mb-3">
            <h2 className="font-bold">{s.name}</h2>
            <p>{s.attendedClasses}/{s.totalClasses}</p>
            <button onClick={() => markPresent(s.id)} className="bg-blue-500 text-white px-2 m-1">
              Present
            </button>
            <button onClick={() => markAbsent(s.id)} className="bg-red-500 text-white px-2 m-1">
              Absent
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
