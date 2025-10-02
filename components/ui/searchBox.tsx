// components/SearchBox.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

// Your 50 keywords organized by category
const KEYWORDS = [
  // General & High-Volume Job Boards
  { text: "jobs in OKC", category: "General" },
  { text: "Oklahoma City jobs", category: "General" },
  { text: "careers Oklahoma City", category: "General" },
  { text: "now hiring OKC", category: "General" },
  { text: "employment Oklahoma City", category: "General" },
  { text: "OKC job openings", category: "General" },
  { text: "OKC part time jobs", category: "General" },
  { text: "OKC full time jobs", category: "General" },
  { text: "entry level jobs OKC", category: "General" },
  { text: "remote jobs Oklahoma City", category: "General" },

  // Gig Economy & Short-Term Work
  { text: "gigs in OKC", category: "Gigs" },
  { text: "Oklahoma City gigs", category: "Gigs" },
  { text: "side jobs OKC", category: "Gigs" },
  { text: "part time gigs near me", category: "Gigs" },
  { text: "weekend work Oklahoma City", category: "Gigs" },
  { text: "one time job OKC", category: "Gigs" },
  { text: "freelance jobs Oklahoma City", category: "Gigs" },
  { text: "quick cash jobs OKC", category: "Gigs" },
  { text: "daily pay jobs OKC", category: "Gigs" },
  { text: "event staff OKC", category: "Gigs" },

  // Healthcare & Biotech
  { text: "healthcare jobs OKC", category: "Healthcare" },
  { text: "biomedical jobs Oklahoma City", category: "Healthcare" },
  { text: "nursing jobs OKC", category: "Healthcare" },
  { text: "medical technician Oklahoma City", category: "Healthcare" },

  // Aviation & Aerospace
  { text: "Tinker AFB jobs", category: "Aviation" },
  { text: "aerospace jobs Oklahoma City", category: "Aviation" },
  { text: "aviation jobs OKC", category: "Aviation" },
  { text: "aircraft mechanic OKC", category: "Aviation" },

  // Energy & Oil/Gas
  { text: "oil and gas jobs Oklahoma City", category: "Energy" },
  { text: "energy jobs OKC", category: "Energy" },
  { text: "Devon jobs OKC", category: "Energy" },
  { text: "Chesapeake Energy jobs", category: "Energy" },

  // Administrative & Office
  { text: "administrative assistant OKC", category: "Office" },
  { text: "office manager jobs Oklahoma City", category: "Office" },
  { text: "data entry OKC", category: "Office" },
  { text: "customer service jobs OKC", category: "Office" },

  // Skilled Trades & Labor
  { text: "construction jobs OKC", category: "Trades" },
  { text: "warehouse jobs Oklahoma City", category: "Trades" },
  { text: "electrician jobs OKC", category: "Trades" },
  { text: "general labor OKC", category: "Trades" },
  { text: "delivery driver OKC", category: "Trades" },

  // Niche & Localized Searches
  { text: "jobs near Bricktown OKC", category: "Local" },
  { text: "downtown OKC jobs", category: "Local" },
  { text: "jobs at Paycom Center", category: "Local" },
  { text: "OU Health Sciences Center jobs", category: "Local" },
  { text: "OKC Public Schools jobs", category: "Local" },
  { text: "City of Oklahoma City jobs", category: "Local" },
  { text: "Tinker AFB civilian jobs", category: "Local" },
  { text: "Will Rogers World Airport jobs", category: "Local" },
  { text: "OKC tech jobs", category: "Local" }
];

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<typeof KEYWORDS>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions(KEYWORDS.slice(0, 10)); // Show first 10 by default
      return;
    }

    const filtered = KEYWORDS.filter(keyword =>
      keyword.text.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limit to 10 results
    
    setSuggestions(filtered);
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: typeof KEYWORDS[0]) => {
    setSearchTerm(suggestion.text);
    setIsOpen(false);
    // Here you would typically trigger the search
    console.log('Searching for:', suggestion.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding to allow for click on suggestions
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Find OKC Gigs & Jobs
      </h2>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(true)}
          placeholder="Start typing to search gigs and jobs..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
        />
        
        {isOpen && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-80 overflow-y-auto z-50"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.text}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                  index === highlightedIndex
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{suggestion.text}</div>
                <div className={`text-sm ${
                  index === highlightedIndex ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {suggestion.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}