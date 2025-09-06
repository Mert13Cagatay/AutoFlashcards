'use client';

import React from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

interface MascotProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const Mascot: React.FC<MascotProps> = ({
  width = 40,
  height = 40,
  className = "",
  alt = "AutoFlashcards Mascot"
}) => {
  const { darkMode } = useAppStore();

  return (
    <Image
      src={darkMode ? "/mascotdark.png" : "/mascot.png"}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-lg object-contain ${className}`}
      priority
    />
  );
};

export default Mascot;
