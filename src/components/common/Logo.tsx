'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'nav';
  showText?: boolean;
  className?: string;
  href?: string;
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  className = '',
  href = '/'
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-28 w-48',
    md: 'h-32 w-52',
    lg: 'h-36 w-56',
    xl: 'h-40 w-60',
    '2xl': 'h-44 w-64',
    nav: 'h-36 w-56'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl',
    nav: 'text-4xl'
  };

  const logoContent = (
    <div className={`flex items-center ${size === 'nav' ? '' : 'space-x-3'} ${className}`}>
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} relative`}>
        <Image
          src="/logo.png" // Replace with your logo path
          alt="AlifDrives Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent ${textSizes[size]}`}>
          AlifDrives
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
