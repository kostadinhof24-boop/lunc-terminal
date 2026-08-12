import { RefreshCw } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  sub: string;
  loading?: boolean;
}

export default function StatCard({ icon, title, value, sub, loading }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-galaxy-gray text-xs uppercase tracking-wider">
          {icon} {title}
        </div>
        <RefreshCw className={`w-3 h-3 text-galaxy-green ${loading ? 'animate-spin' : ''}`} />
      </div>
      <div className="text-xl font-bold text-galaxy-white">{value}</div>
      <div className="text-xs text-galaxy-gray mt-1">{sub}</div>
    </div>
  );
}
