"use client";
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import { Settings as SettingsIcon, Eye, EyeOff } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/lib/translations';
export default function SettingsPage() {
  const { isExpertMode, toggleExpertMode } = useSettingsStore();
  const lang = useLanguageStore((state) => state.lang);
  const t = useTranslation(lang);
  return (<main className='min-h-screen relative container mx-auto px-6 py-8 max-w-4xl'><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='glass-card rounded-3xl p-8 mb-6'><h1 className='text-3xl font-bold mb-2 flex items-center gap-3'><SettingsIcon className='w-8 h-8 text-terra-yellow' /> {t.settings.title}</h1><p className='text-galaxy-gray text-sm'>{t.settings.subtitle}</p></motion.div><div className='glass-card rounded-3xl p-8'><div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-space-bg/50 rounded-2xl'><div className='flex items-center gap-4'>{isExpertMode ? <Eye className='w-6 h-6 text-galaxy-blue' /> : <EyeOff className='w-6 h-6 text-galaxy-gray' />}<div><h2 className='text-xl font-bold text-galaxy-white'>{t.settings.expertTitle}</h2><p className='text-sm text-galaxy-gray'>{isExpertMode ? t.settings.expertDescOn : t.settings.expertDescOff}</p></div></div><button onClick={toggleExpertMode} className={`relative w-16 h-8 rounded-full transition-colors ${isExpertMode ? 'bg-galaxy-blue' : 'bg-galaxy-gray/30'}`}><span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${isExpertMode ? 'translate-x-9' : 'translate-x-1'}`} /></button></div></div></main>);
}