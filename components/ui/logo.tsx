'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'dark'
  showText?: boolean
  textSize?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl'
}

export function Logo({ 
  className, 
  size = 'md', 
  variant = 'default',
  showText = true,
  textSize = 'md'
}: LogoProps) {
  const logoClasses = cn(sizeClasses[size], className)
  const textClasses = cn(
    'font-bold tracking-tight',
    textSizeClasses[textSize],
    variant === 'white' ? 'text-white' : variant === 'dark' ? 'text-gray-900' : 'bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent'
  )

  const LogoSVG = () => (
    <svg 
      className={logoClasses}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle with Gradient */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={variant === 'white' ? '#ffffff' : '#3B82F6'} />
          <stop offset="100%" stopColor={variant === 'white' ? '#f1f5f9' : '#1E40AF'} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={variant === 'white' ? '#ffffff' : '#10B981'} />
          <stop offset="100%" stopColor={variant === 'white' ? '#f0fdf4' : '#059669'} />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={variant === 'white' ? '#ffffff' : '#F59E0B'} />
          <stop offset="100%" stopColor={variant === 'white' ? '#fefce8' : '#D97706'} />
        </linearGradient>
      </defs>
      
      {/* Main Circle Background */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        fill="url(#gradient1)" 
        opacity="0.1"
      />
      
      {/* Brain/Knowledge Symbol */}
      <g transform="translate(20, 20)">
        {/* Brain outline */}
        <path 
          d="M30 15 C35 10, 45 10, 50 15 C55 12, 60 15, 60 25 C65 25, 65 35, 60 35 C65 40, 60 45, 55 45 C50 50, 40 50, 35 45 C30 50, 20 45, 20 35 C15 35, 15 25, 20 25 C20 15, 25 12, 30 15 Z" 
          fill="url(#gradient2)"
          opacity="0.8"
        />
        
        {/* Neural connections */}
        <circle cx="25" cy="25" r="2" fill="url(#gradient3)" />
        <circle cx="35" cy="20" r="1.5" fill="url(#gradient3)" />
        <circle cx="45" cy="25" r="2" fill="url(#gradient3)" />
        <circle cx="55" cy="30" r="1.5" fill="url(#gradient3)" />
        <circle cx="35" cy="35" r="1.5" fill="url(#gradient3)" />
        <circle cx="45" cy="40" r="2" fill="url(#gradient3)" />
        
        {/* Connection lines */}
        <line x1="25" y1="25" x2="35" y2="20" stroke="url(#gradient3)" strokeWidth="1" opacity="0.6" />
        <line x1="35" y1="20" x2="45" y2="25" stroke="url(#gradient3)" strokeWidth="1" opacity="0.6" />
        <line x1="45" y1="25" x2="55" y2="30" stroke="url(#gradient3)" strokeWidth="1" opacity="0.6" />
        <line x1="35" y1="35" x2="45" y2="40" stroke="url(#gradient3)" strokeWidth="1" opacity="0.6" />
        <line x1="25" y1="25" x2="35" y2="35" stroke="url(#gradient3)" strokeWidth="1" opacity="0.6" />
      </g>
      
      {/* Book/Knowledge Pages */}
      <g transform="translate(15, 55)">
        <rect x="10" y="5" width="50" height="30" rx="2" fill="url(#gradient1)" opacity="0.7" />
        <rect x="15" y="10" width="40" height="20" rx="1" fill="url(#gradient2)" opacity="0.5" />
        <line x1="20" y1="15" x2="50" y2="15" stroke="url(#gradient3)" strokeWidth="1.5" opacity="0.8" />
        <line x1="20" y1="20" x2="45" y2="20" stroke="url(#gradient3)" strokeWidth="1" opacity="0.6" />
        <line x1="20" y1="25" x2="50" y2="25" stroke="url(#gradient3)" strokeWidth="1" opacity="0.6" />
      </g>
    </svg>
  )

  if (!showText) {
    return <LogoSVG />
  }

  return (
    <div className="flex items-center space-x-2">
      <LogoSVG />
      <span className={textClasses}>
        PrepWithAI
      </span>
    </div>
  )
}

// Favicon component for the browser tab
export function FaviconSVG() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fav-gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="fav-gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      <rect width="100" height="100" fill="url(#fav-gradient1)" />
      
      {/* Simplified brain symbol for favicon */}
      <circle cx="50" cy="35" r="20" fill="url(#fav-gradient2)" opacity="0.9" />
      <circle cx="45" cy="30" r="2" fill="white" />
      <circle cx="55" cy="30" r="2" fill="white" />
      <circle cx="50" cy="40" r="1.5" fill="white" />
      
      {/* Book symbol */}
      <rect x="35" y="60" width="30" height="20" rx="2" fill="white" opacity="0.9" />
      <line x1="40" y1="65" x2="60" y2="65" stroke="url(#fav-gradient1)" strokeWidth="2" />
      <line x1="40" y1="70" x2="55" y2="70" stroke="url(#fav-gradient1)" strokeWidth="1.5" />
      <line x1="40" y1="75" x2="60" y2="75" stroke="url(#fav-gradient1)" strokeWidth="1.5" />
    </svg>
  )
}
