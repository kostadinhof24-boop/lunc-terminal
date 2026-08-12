'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useStaking } from '@/features/staking/hooks/useStaking';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader, PieChart as PieIcon } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

export default function AnalyticsPanel() {
  const { validators } = useStaking();
  
  // Utilisation de la route API locale pour éviter les erreurs CORS du navigateur
  const { data: dashboardData, isLoading: isLoadingSupply } = useQuery({
    queryKey: ['dashboardDataForPanel'],
    queryFn: async () => {
      const res = await axios.get('/api/dashboard');
      return res.data;
    }
  });

  const topValidators = [...validators].sort((a, b) => parseFloat(b.tokens) - parseFloat(a.tokens)).slice(0, 5);
  const otherPower = validators.slice(5).reduce((sum, v) => sum + parseFloat(v.tokens), 0);
  const validatorData = [
    ...topValidators.map(v => ({ name: v.description.moniker.substring(0, 15), value: parseFloat(v.tokens) / 1_000_000 })),
    { name: 'Others', value: otherPower / 1_000_000 }
  ];

  const supplyData = dashboardData?.totalSupply || 0;
  const stakedData = dashboardData?.staked || 0;
  const communityPoolData = dashboardData?.communityPool || 0;

  const circulating = supplyData - stakedData - communityPoolData;
  const tokenomicsData = [
    { name: 'Circulating', value: circulating > 0 ? circulating / 1_000_000_000 : 0 },
    { name: 'Staked', value: stakedData / 1_000_000_000 },
    { name: 'Comm. Pool', value: communityPoolData / 1_000_000_000 }
  ];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      <div className='glass-card rounded-3xl p-8'>
        <h3 className='text-xl font-bold mb-6 flex items-center gap-3'><PieIcon className='w-6 h-6 text-galaxy-blue' /> Voting Power Distribution</h3>
        {validators.length === 0 ? (
          <div className='flex justify-center py-12'><Loader className='w-8 h-8 animate-spin text-galaxy-blue' /></div>
        ) : (
          <div className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={validatorData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={80} innerRadius={40} minAngle={5} label>
                  {validatorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0B1022', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className='glass-card rounded-3xl p-8'>
        <h3 className='text-xl font-bold mb-6 flex items-center gap-3'><PieIcon className='w-6 h-6 text-terra-yellow' /> LUNC Tokenomics (in Billions)</h3>
        {isLoadingSupply ? (
          <div className='flex justify-center py-12'><Loader className='w-8 h-8 animate-spin text-terra-yellow' /></div>
        ) : (
          <div className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={tokenomicsData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={80} innerRadius={40} minAngle={10} label>
                  <Cell fill='#10B981' />
                  <Cell fill='#3B82F6' />
                  <Cell fill='#F59E0B' />
                </Pie>
                <Tooltip contentStyle={{ background: '#0B1022', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}