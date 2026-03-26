import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Wind, 
  Flame, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  Activity,
  Stethoscope
} from 'lucide-react';

const GUIDES = [
  {
    id: 'cpr',
    title: 'CPR (Adult)',
    icon: Heart,
    color: 'bg-red-500',
    steps: [
      'Check the scene for safety.',
      'Check for responsiveness (tap and shout).',
      'Call 108 immediately.',
      'Push hard and fast in the center of the chest (100-120 bpm).',
      'Continue until professional help arrives.'
    ]
  },
  {
    id: 'choking',
    title: 'Choking',
    icon: Wind,
    color: 'bg-blue-500',
    steps: [
      'Encourage the person to cough.',
      'If they cannot breathe, perform 5 back blows.',
      'Perform 5 abdominal thrusts (Heimlich maneuver).',
      'Alternate between 5 blows and 5 thrusts.',
      'Call 108 if they become unconscious.'
    ]
  },
  {
    id: 'burns',
    title: 'Severe Burns',
    icon: Flame,
    color: 'bg-orange-500',
    steps: [
      'Stop the burning process (remove from heat).',
      'Cool the burn with cool (not cold) running water for 10-20 mins.',
      'Remove jewelry or tight clothing before swelling starts.',
      'Cover loosely with sterile dressing or plastic wrap.',
      'Seek medical help for deep or large burns.'
    ]
  },
  {
    id: 'fracture',
    title: 'Fractures',
    icon: Activity,
    color: 'bg-purple-500',
    steps: [
      'Do not try to realign the bone.',
      'Stop any bleeding with a clean cloth.',
      'Immobilize the injured area using a splint or sling.',
      'Apply ice packs to limit swelling and help relieve pain.',
      'Treat for shock if the person feels faint.'
    ]
  }
];

export default function EmergencyGuide() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % GUIDES.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + GUIDES.length) % GUIDES.length);

  const active = GUIDES[activeIndex];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[#D9534F] p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6" />
          <h3 className="text-xl font-bold">Quick Emergency Guide</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className={`${active.color} p-4 rounded-2xl text-white shadow-lg`}>
                <active.icon className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold text-[#0B3C5D]">{active.title}</h4>
            </div>
            
            <div className="space-y-4">
              {active.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-[#328CC1] text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Disclaimer: For educational purposes only.
          </p>
          <div className="flex gap-1">
            {GUIDES.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-[#D9534F]' : 'w-1.5 bg-gray-200'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
