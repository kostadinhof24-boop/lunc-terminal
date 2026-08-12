'use client';
import { useLanguageStore, Language } from '@/store/languageStore';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguageStore();

  const langs: { code: Language; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '中' }
  ];

  return (
    <div className='flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1'>
      <Globe className='w-4 h-4 text-galaxy-gray-muted ml-2 mr-1' />
      {langs.map((l) => (
        <button 
          key={l.code} 
          onClick={() => setLang(l.code)}
          className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${lang === l.code ? 'bg-galaxy-blue text-white' : 'text-galaxy-gray-muted hover:text-galaxy-white'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}