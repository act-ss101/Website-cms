import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  aboutTitle: string;
  aboutText: string;
  newsItems: NewsItem[];
  announcements: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  published: boolean;
}

export interface CMSTheme {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  radius: string;
}

export interface CMSLayout {
  heroStyle: 'cinematic' | 'minimal' | 'split';
  navStyle: 'transparent' | 'solid' | 'floating';
  cardStyle: 'elevated' | 'flat' | 'bordered';
  footerStyle: 'full' | 'compact' | 'minimal';
}

interface CMSContextType {
  content: CMSContent;
  setContent: (content: CMSContent) => void;
  theme: CMSTheme;
  setTheme: (theme: CMSTheme) => void;
  layout: CMSLayout;
  setLayout: (layout: CMSLayout) => void;
  themes: CMSTheme[];
  isCMSEnabled: boolean;
  setIsCMSEnabled: (v: boolean) => void;
}

const defaultContent: CMSContent = {
  heroTitle: "Bangkok's Most Refined\nUrban Golf Sanctuary",
  heroSubtitle: "Where exclusivity meets effortless service. A private club that anticipates your every need.",
  heroCTA: "Reserve Your Tee Time",
  aboutTitle: "A Legacy of Excellence",
  aboutText: "Since 1972, Krungthep Kreetha has been the distinguished home of Bangkok's golfing elite. Our championship course, designed to challenge and inspire, offers an unparalleled experience where tradition meets modern luxury.",
  newsItems: [
    { id: '1', title: 'Annual Members Championship 2026', excerpt: 'Registration now open for our flagship tournament. March 15-17.', date: '2026-02-01', category: 'Tournament', published: true },
    { id: '2', title: 'New Seasonal Menu at The 19th Hole', excerpt: 'Chef Somchai presents his spring collection featuring local ingredients.', date: '2026-01-28', category: 'Dining', published: true },
    { id: '3', title: 'Course Maintenance Schedule', excerpt: 'Greens aeration planned for February 20-22. Temporary greens in use.', date: '2026-01-25', category: 'Course', published: true },
    { id: '4', title: 'Junior Development Program', excerpt: 'Enrolling young golfers ages 8-16 for our summer intensive program.', date: '2026-01-20', category: 'Program', published: true },
  ],
  announcements: [
    'Next tee time release: Saturday slots open Monday 7:00 AM',
    'Complimentary club fitting sessions available through February',
    'New caddie training program launched — meet our certified team',
  ],
};

const themes: CMSTheme[] = [
  { name: 'Classic Forest', primary: '#1B3A2F', secondary: '#C9A227', background: '#F5F0E8', text: '#2C2C2C', radius: '8px' },
  { name: 'Midnight Gold', primary: '#0F172A', secondary: '#F59E0B', background: '#1E293B', text: '#F1F5F9', radius: '12px' },
  { name: 'Royal Purple', primary: '#4A1D6A', secondary: '#E8B84B', background: '#FAF5FF', text: '#2D1B4E', radius: '16px' },
  { name: 'Pure White', primary: '#1B3A2F', secondary: '#C9A227', background: '#FFFFFF', text: '#1A1A1A', radius: '4px' },
  { name: 'Warm Earth', primary: '#3D2B1F', secondary: '#B8860B', background: '#FFF8F0', text: '#2C1810', radius: '8px' },
];

const defaultLayout: CMSLayout = {
  heroStyle: 'cinematic',
  navStyle: 'transparent',
  cardStyle: 'elevated',
  footerStyle: 'full',
};

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CMSContent>(defaultContent);
  const [theme, setTheme] = useState<CMSTheme>(themes[0]);
  const [layout, setLayout] = useState<CMSLayout>(defaultLayout);
  const [isCMSEnabled, setIsCMSEnabled] = useState(false);

  return (
    <CMSContext.Provider value={{ content, setContent, theme, setTheme, layout, setLayout, themes, isCMSEnabled, setIsCMSEnabled }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) throw new Error('useCMS must be used within CMSProvider');
  return context;
}
