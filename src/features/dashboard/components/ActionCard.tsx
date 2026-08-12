import { ReactNode } from 'react';

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

export default function ActionCard({ icon, title, desc }: ActionCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 hover:border-terra-yellow transition-all cursor-pointer">
      {icon}
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-galaxy-gray text-sm">{desc}</p>
    </div>
  );
}
