import React, { useState, useEffect } from 'react';
import { Microscope, Activity, MapPin, Beaker, User, Film, RefreshCcw } from 'lucide-react';

const HospitalTNKGame = () => {
  const [target, setTarget] = useState(null);
  const [revealed, setRevealed] = useState({});
  const [tickets, setTickets] = useState(8); // 마커가 늘어나 티켓을 8개로 상향
  const [status, setStatus] = useState('playing');

  // 병원 항체 판넬 (제공해주신 이미지 기반)
  const hospitalMarkers = [
    'ALK-1', 'CD10', 'CD21', 'CD30', 'CD56', 'Granzyme B',
    'CD4', 'CD8', 'EMA', 'Ki-67', 'PD-1', 'Bcl6', 'CD3', 'CD20', 'EBER-ISH'
  ];

  const diseaseDB = [
    { 
      id: 'AITL', category: 'Nodal TFH', site: 'Lymph Node', name: 'nTFH lymphoma, angioimmunoblastic type',
      age: '60s', gender: 'Male', symptom: 'Generalized lymphadenopathy, B symptoms, skin rash.',
      petCt: 'Diffuse hypermetabolic lymphadenopathy, Splenomegaly.',
      heImage: '/images/aitl_he.jpg', // GitHub public/images 폴더에 올릴 파일명
      markers: { 
        'CD3': '+', 'CD4': '+', 'CD10': '+', 'PD-1': '+', 'Bcl6': '+', 
        'CD21': '+(FDC meshwork expansion)', 'CD20': '-(Scattered B-cells only)', 'Ki-67': '60-70%', 'EBER-ISH': '-/+(Occasional)'
      }
    },
    { 
      id: 'ENKTL', category: 'EBV+ T/NK', site: 'Nasal Cavity', name: 'Extranodal NK/T-cell lymphoma',
      age: '50s', gender: 'Male', symptom: 'Nasal obstruction, midfacial destructive lesion.',
      petCt: 'Intense FDG uptake in the nasal cavity and paranasal sinuses.',
      heImage: '/images/enktl_he.jpg',
      markers: { 
        'CD3': '+(Cytoplasmic ε)', 'CD56': '+', 'EBER-ISH': '+++(Diffuse)', 'Granzyme B': '+', 
        'Ki-67': '80-90%', 'CD20': '-', 'EMA': '-'
      }
    },
    { 
      id: 'ALCL_ALK_POS', category: 'ALCL', site: 'Lymph Node', name: 'ALK-positive anaplastic large cell lymphoma',
      age: '25', gender: 'Male', symptom: 'Rapidly enlarging cervical lymph node, high fever.',
      petCt: 'Bulky hypermetabolic nodal masses.',
      heImage: '/images/alcl_alk_he.jpg',
      markers: { 
        'CD30': '+++(Strong/Membranous)', 'ALK-1': '+(Nuclear & Cyto)', 'EMA': '+', 
        'CD3': '-(Loss in 75%)', 'CD4': '+', 'Ki-67': '90%', 'CD20': '-'
      }
    },
    { 
      id: 'PTCL_NOS', category: 'Peripheral T-cell', site: 'Lymph Node', name: 'Peripheral T-cell lymphoma, NOS',
      age: '65', gender: 'Female', symptom: 'Generalized lymphadenopathy.',
      petCt: 'Multifocal hypermetabolic lymph nodes above and below the diaphragm.',
      heImage: '/images/ptcl_nos_he.jpg',
      markers: { 
        'CD3': '+', 'CD4': '+', 'CD8': '-', 'CD56': '-', 'CD30': '-/+(Variable)', 
        'Ki-67': '70%', 'CD20': '-', 'EBER-ISH': '-'
      }
    }
    // 추가 질환들을 같은 형식으로 확장 가능합니다.
  ];

  const initGame = () => {
    setTarget(diseaseDB[Math.floor(Math.random() * diseaseDB.length)]);
    setRevealed({});
    setTickets(8);
    setStatus('playing');
  };

  useEffect(() => { initGame(); }, []);

  const runTest = (m) => {
    if (tickets > 0 && !revealed[m]) {
      setRevealed({ ...revealed, [m]: target.markers[m] || 'Negative (-)' });
      setTickets(tickets - 1);
    }
  };

  if (!target) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 font-sans">
      <div className="max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Hospital Brand Header */}
        <div className="p-5 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Activity className="text-emerald-400" />
            <h1 className="text-lg font-bold tracking-tight">PATHOLOGY SIMULATOR <span className="text-slate-500 font-light">| Hospital Panel Mode</span></h1>
          </div>
          <div className="bg-slate-950 px-4 py-1.5 rounded-full border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-black">Lab Tickets: </span>
            <span className="text-emerald-400 font-mono font-bold">{tickets}</span>
          </div>
        </div>

        {/* Clinical Summary */}
        <div className="grid md:grid-cols-4 border-b border-slate-800 bg-slate-900/50">
          <div className="p-4 border-r border-slate-800">
            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Patient</span>
            <p className="text-sm font-semibold">{target.age}/ {target.gender}</p>
          </div>
          <div className="p-4 border-r border-slate-800">
            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Site</span>
            <p className="text-sm font-semibold text-emerald-400">{target.site}</p>
          </div>
          <div className="p-4 col-span-2">
            <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Clinical / Imaging</span>
            <p className="text-xs leading-relaxed text-slate-300">{target.symptom} <br/> <span className="text-slate-500">{target.petCt}</span></p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-6">
          {/* Histology Image Container */}
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-slate-800 overflow-hidden bg-slate-950 aspect-square flex items-center justify-center relative group">
              <img src={target.heImage} alt="H&E Histology" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Microscope className="text-white" size={48} />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-500">
               <span className="text-[10px] font-bold uppercase tracking-widest">H&E Stain View</span>
            </div>
          </div>

          {/* IHC Panel Control */}
          <div className="md:col-span-2 space-y-6">
            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
                <Beaker size={14} /> Available Hospital Panel
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {hospitalMarkers.map(m => (
                  <button
                    key={m}
                    onClick={() => runTest(m)}
                    disabled={status !== 'playing' || revealed[m] || tickets === 0}
                    className={`py-2 text-[10px] font-bold rounded-md border transition-all ${
                      revealed[m] ? 'bg-slate-800 border-slate-700 text-slate-600' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-slate-950 rounded-xl p-4 border border-slate-800 min-h-[180px]">
              <h3 className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Test Results</h3>
              <div className="space-y-1.5">
                {Object.entries(revealed).map(([m, res]) => (
                  <div key={m} className="flex justify-between border-b border-slate-900 pb-1 animate-in fade-in duration-300">
                    <span className="text-slate-400 font-mono text-[11px]">{m}</span>
                    <span className={`text-[11px] font-bold ${res.includes('+') ? 'text-emerald-400' : 'text-slate-600'}`}>{res}</span>
                  </div>
                ))}
                {Object.keys(revealed).length === 0 && <div className="h-24 flex items-center justify-center text-slate-700 text-xs italic">Select markers to run IHC...</div>}
              </div>
            </section>
          </div>
        </div>

        {/* Diagnosis Selection */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <h3 className="text-center text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Differential Diagnosis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {diseaseDB.map(d => (
              <button
                key={d.id}
                onClick={() => setStatus(d.id === target.id ? 'won' : 'lost')}
                className="py-2.5 text-[10px] border border-slate-800 rounded bg-slate-950 hover:border-emerald-500 transition-all font-bold"
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status Overlay */}
        {status !== 'playing' && (
          <div className={`p-10 text-center ${status === 'won' ? 'bg-emerald-600 text-white' : 'bg-rose-700 text-white'}`}>
            <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">
              {status === 'won' ? 'Confirmed Diagnosis' : 'Incorrect Diagnosis'}
            </h2>
            <p className="text-sm font-medium mb-6 italic">Target: {target.name}</p>
            <button 
              onClick={initGame} 
              className="bg-white text-slate-900 px-8 py-2.5 rounded-full font-black text-xs hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              <RefreshCcw size={14} /> NEXT CASE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalTNKGame;