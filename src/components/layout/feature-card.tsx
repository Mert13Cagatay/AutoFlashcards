'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: 'blue' | 'red' | 'yellow' | 'green';
  buttonText?: string;
  onClick?: () => void;
  delay?: number;
}

const gradientClasses = {
  blue: 'gradient-blue',
  red: 'gradient-red',
  yellow: 'gradient-yellow',
  green: 'gradient-green',
};

const textColors = {
  blue: 'text-blue-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  green: 'text-green-600',
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  buttonText,
  onClick,
  delay = 0,
}) => {
  return (
    <div 
      className="card-google p-6 group animate-float"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon with gradient background */}
      <div className={`w-16 h-16 rounded-2xl ${gradientClasses[gradient]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-8 w-8 text-white" />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className={`text-xl font-bold ${textColors[gradient]} dark:text-white`}>
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {description}
        </p>

        {buttonText && onClick && (
          <Button
            onClick={onClick}
            variant="outline"
            className={`
              w-full mt-6 border-2 transition-all duration-300
              hover:bg-gradient-to-r hover:text-white hover:border-transparent
              group-hover:shadow-xl
              ${gradient === 'blue' ? 'border-blue-200 hover:from-blue-500 hover:to-blue-600 text-blue-600' : ''}
              ${gradient === 'red' ? 'border-red-200 hover:from-red-500 hover:to-red-600 text-red-600' : ''}
              ${gradient === 'yellow' ? 'border-yellow-200 hover:from-yellow-500 hover:to-yellow-600 text-yellow-600' : ''}
              ${gradient === 'green' ? 'border-green-200 hover:from-green-500 hover:to-green-600 text-green-600' : ''}
            `}
          >
            {buttonText}
          </Button>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default FeatureCard;
