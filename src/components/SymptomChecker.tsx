import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Activity, AlertCircle, ChevronRight, CheckCircle2, Stethoscope } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
}

interface DiseaseSuggestion {
  name: string;
  department: string;
  symptoms: string[];
  disclaimer: string;
}

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<DiseaseSuggestion | null>(null);

  const symptoms: Symptom[] = [
    { id: 'fever', name: 'Fever' },
    { id: 'cough', name: 'Cough' },
    { id: 'headache', name: 'Headache' },
    { id: 'stomach_pain', name: 'Stomach Pain' },
    { id: 'fatigue', name: 'Fatigue' },
    { id: 'sore_throat', name: 'Sore Throat' },
    { id: 'nausea', name: 'Nausea' },
    { id: 'body_ache', name: 'Body Ache' },
    { id: 'shortness_of_breath', name: 'Shortness of Breath' },
    { id: 'skin_rash', name: 'Skin Rash' },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setResult(null);
  };

  const checkSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    let suggestion: DiseaseSuggestion = {
      name: 'General Consultation',
      department: 'General OPD',
      symptoms: selectedSymptoms,
      disclaimer: 'This is not a medical diagnosis. Please consult a doctor for an accurate assessment.'
    };

    if (selectedSymptoms.includes('fever') && selectedSymptoms.includes('cough')) {
      suggestion = { ...suggestion, name: 'Possible Flu or Viral Infection', department: 'General OPD' };
    } else if (selectedSymptoms.includes('fever') && selectedSymptoms.includes('headache')) {
      suggestion = { ...suggestion, name: 'Possible Viral Infection', department: 'General OPD' };
    } else if (selectedSymptoms.includes('stomach_pain') || selectedSymptoms.includes('nausea')) {
      suggestion = { ...suggestion, name: 'Possible Gastric Issue', department: 'General OPD' };
    } else if (selectedSymptoms.includes('shortness_of_breath')) {
      suggestion = { ...suggestion, name: 'Respiratory Concern', department: 'Emergency / ICU' };
    } else if (selectedSymptoms.includes('skin_rash')) {
      suggestion = { ...suggestion, name: 'Dermatological Issue', department: 'Dermatology' };
    }

    setResult(suggestion);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[#0B3C5D] p-8 text-white">
        <div className="flex items-center space-x-3 mb-2">
          <Activity className="h-6 w-6 text-[#328CC1]" />
          <h2 className="text-2xl font-bold">Symptom Checker</h2>
        </div>
        <p className="text-blue-100 text-sm">Select your symptoms for a preliminary suggestion.</p>
      </div>

      <div className="p-8">
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Select Symptoms</h3>
          <div className="flex flex-wrap gap-3">
            {symptoms.map((symptom) => (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  selectedSymptoms.includes(symptom.id)
                  ? 'bg-[#328CC1] text-white border-[#328CC1] shadow-md'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#328CC1] hover:text-[#328CC1]'
                }`}
              >
                {symptom.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={checkSymptoms}
            disabled={selectedSymptoms.length === 0}
            className="bg-[#0B3C5D] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#082d46] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Check Now</span>
          </button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl text-[#328CC1]">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Suggested Result</h4>
                  <p className="text-2xl font-bold text-[#0B3C5D]">{result.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Recommended Dept</p>
                  <p className="text-lg font-bold text-[#328CC1]">{result.department}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Symptoms</p>
                  <p className="text-sm font-medium text-gray-600">{result.symptoms.length} selected</p>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-xl flex items-start space-x-3 mb-8">
                <AlertCircle className="h-5 w-5 text-[#D9534F] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#D9534F] font-medium leading-relaxed">
                  {result.disclaimer}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.location.href = '/appointment'}
                  className="flex-grow bg-[#D9534F] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#c9302c] transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Book Appointment Now</span>
                </button>
                <button 
                  onClick={() => { setSelectedSymptoms([]); setResult(null); }}
                  className="px-8 py-4 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-white transition-all"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
