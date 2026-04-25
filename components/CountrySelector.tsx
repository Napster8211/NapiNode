'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check } from 'lucide-react';

// Our mock database of available NapiNode regions
export const AVAILABLE_NODES = [
  { id: 'us-ny', country: 'United States', region: 'New York', code: 'US', flag: '🇺🇸' },
  { id: 'us-la', country: 'United States', region: 'Los Angeles', code: 'US', flag: '🇺🇸' },
  { id: 'uk-lon', country: 'United Kingdom', region: 'London', code: 'GB', flag: '🇬🇧' },
  { id: 'gh-acc', country: 'Ghana', region: 'Accra', code: 'GH', flag: '🇬🇭' },
  { id: 'ca-tor', country: 'Canada', region: 'Toronto', code: 'CA', flag: '🇨🇦' },
];

export type NapiNodeLocation = typeof AVAILABLE_NODES[0];

interface CountrySelectorProps {
  selectedNode: NapiNodeLocation;
  onSelect: (node: NapiNodeLocation) => void;
  disabled?: boolean;
}

export default function CountrySelector({ selectedNode, onSelect, disabled }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mb-10" ref={dropdownRef}>
      {/* The Main Clickable Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between rounded-xl border p-4 backdrop-blur-sm transition-all ${
          disabled 
            ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed' 
            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer shadow-lg'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="bg-black/50 p-2 rounded-lg border border-white/5">
            <MapPin className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Target Node</p>
            <p className="text-lg text-white font-semibold flex items-center gap-2">
              <span className="text-xl">{selectedNode.flag}</span>
              {selectedNode.region}, {selectedNode.code}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-500/20">
            Clean IP
          </span>
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* The Glass-morphism Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full z-50 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {AVAILABLE_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => {
                  onSelect(node);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedNode.id === node.id 
                    ? 'bg-blue-600/20 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{node.flag}</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{node.region}</p>
                    <p className="text-xs opacity-70">{node.country}</p>
                  </div>
                </div>
                {selectedNode.id === node.id && (
                  <Check className="h-5 w-5 text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}