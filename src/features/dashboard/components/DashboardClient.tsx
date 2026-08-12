"use client";
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Coins, BarChart2, Activity, DollarSign, Users, ShieldCheck } from 'lucide-react';
import StatCard from './StatCard';
import AnalyticsPanel from '@/features/analytics/components/AnalyticsPanel';

interface NetworkStats { totalSupply: number; staked: number; stakedRatio: number; communityPool: number; activeValidators: number; }

function useNetworkStats() {
  return useQuery<NetworkStats>({
    queryKey: ['advancedNetworkStatsV12'],
    queryFn: async () => {
      // Utilisation de notre route API locale pour Ã©viter le blocage CORS du navigateur
      const res = await axios.get('/api/dashboard');
      const data = res.data;
      const totalSupply = data.totalSupply || 0;
      const staked = data.staked || 0;
      return { 
        totalSupply, 
        staked, 
        stakedRatio: totalSupply > 0 ? (staked / totalSupply) * 100 : 0, 
        communityPool: data.communityPool || 0, 
        activeValidators: data.validators || 0 
      };
    },
    refetchInterval: 60000,
  });
}

function useMarketData() {
  return useQuery({
    queryKey: ['marketDataApiLocal'],
    queryFn: async () => { 
      const res = await axios.get('/api/price'); 
      return res.data; 
    },
    refetchInterval: 120000,
  });
}

export default function DashboardClient() {
  const { data: stats, isLoading } = useNetworkStats();
  const { data: marketData } = useMarketData();

  const formatNum = (num: number) => {
    if (!num) return '0';
    if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + 'T';
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  return (
    <main className='min-h-screen relative container mx-auto px-6 py-8 max-w-7xl pt-24'>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className='glass-card rounded-3xl p-8 mb-6'>
        <h1 className='text-2xl font-bold'>Network Dashboard</h1>
        <p className='text-galaxy-gray text-sm'>Real-time analysis of the Terra Classic ecosystem.</p>
      </motion.div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
        <StatCard icon={<Coins className='w-5 h-5 text-terra-yellow' />} title="Total Supply" value={isLoading ? '...' : formatNum(stats?.totalSupply || 0)} sub="LUNC" loading={isLoading} />
        <StatCard icon={<Users className='w-5 h-5 text-galaxy-blue' />} title="Staked" value={isLoading ? '...' : formatNum(stats?.staked || 0)} sub={isLoading ? '' : `${stats?.stakedRatio.toFixed(2)}% of supply`} loading={isLoading} />
        <StatCard icon={<ShieldCheck className='w-5 h-5 text-galaxy-green' />} title="Validators" value={isLoading ? '...' : (stats?.activeValidators || 0).toLocaleString()} sub="Active" loading={isLoading} />
        <StatCard icon={<Activity className='w-5 h-5 text-galaxy-green' />} title="Community Pool" value={isLoading ? '...' : formatNum(stats?.communityPool || 0)} sub="LUNC" loading={isLoading} />
        <StatCard icon={<DollarSign className='w-5 h-5 text-galaxy-green' />} title="LUNC Price" value={marketData ? `$${marketData.price.toFixed(6)}` : '...'} sub={marketData ? `${marketData.change24h.toFixed(1)}%` : '...'} loading={!marketData} />
        <StatCard icon={<BarChart2 className='w-5 h-5 text-galaxy-blue' />} title="Market Cap" value={marketData && stats ? `$${formatNum(marketData.price * stats.totalSupply)}` : '...'} sub="USD" loading={!marketData || !stats} />
      </div>

      <AnalyticsPanel />
    </main>
  );
}


