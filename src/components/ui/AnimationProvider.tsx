'use client'

import React from 'react';
import { Box } from '@chakra-ui/react';
import { animations } from '@/utils/styling';

interface AnimationProviderProps {
  children: React.ReactNode;
}

/**
 * AnimationProvider component that provides CSS animations without dangerouslySetInnerHTML
 * This replaces the need for inline style tags with animations
 */
export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  return (
    <>
      {/* Global animation styles */}
      <style jsx global>{`
        ${animations.fadeIn}
        ${animations.slideUp}
        ${animations.fadeInScale}
        ${animations.pulse}
        
        /* Fade out animation for splash screen */
        .fadeOut {
          animation: fadeOutAnim 0.8s ease-in-out forwards;
        }
        
        @keyframes fadeOutAnim {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); }
        }
        
        /* Loading bar animation */
        .loading-bar {
          animation: loadingBar 3.5s ease-in-out;
        }
        
        @keyframes loadingBar {
          0% { width: 0%; }
          20% { width: 30%; }
          40% { width: 60%; }
          80% { width: 90%; }
          100% { width: 100%; }
        }
        
        /* Card flip animations */
        .card-flip {
          animation: fadeInScale 0.6s ease-out;
        }
        
        .card-flip:hover {
          animation: pulse 2s infinite;
        }
        
        /* Slide animations for carousels */
        .slide-enter {
          animation: slideInRight 0.5s ease-out;
        }
        
        .slide-exit {
          animation: slideOutLeft 0.5s ease-out;
        }
        
        @keyframes slideInRight {
          from { 
            transform: translateX(100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutLeft {
          from { 
            transform: translateX(0);
            opacity: 1;
          }
          to { 
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        /* Prism icon rotation */
        .prism-icon {
          transition: transform 0.3s ease;
        }
        
        .prism-icon.rotated {
          transform: rotate(180deg);
        }
        
        /* Focus management */
        .focus-visible {
          outline: 2px solid var(--chakra-colors-brand-accent);
          outline-offset: 2px;
        }
        
        /* Skip links */
        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: var(--chakra-colors-brand-primary);
          color: white;
          padding: 8px;
          text-decoration: none;
          border-radius: 4px;
          z-index: 9999;
          transition: top 0.3s;
        }
        
        .skip-link:focus {
          top: 6px;
        }
        
        /* Global CSS variable overrides for consistent theming */
        :root {
          --lex-deep-blue: var(--chakra-colors-brand-primary);
          --lex-insight-blue: var(--chakra-colors-brand-accent);
          --lex-slate-grey: var(--chakra-colors-text-secondary);
          --lex-off-white: var(--chakra-colors-bg-canvas);
          --lex-light-grey: var(--chakra-colors-bg-muted);
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .card-flip,
          .primary-button,
          .secondary-button {
            border: 2px solid currentColor;
          }
        }
        
        /* Service card animations */
        .service-card {
          animation: fadeInScale 0.8s ease-out forwards;
          transition: all 0.3s ease;
          perspective: 1000px;
        }
        
        .service-card:nth-of-type(1) {
          animation-delay: 0.2s;
        }
        
        .service-card:nth-of-type(2) {
          animation-delay: 0.4s;
        }
        
        /* Card Flip Animation */
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1000px;
        }
        
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          transition: transform 0.6s, opacity 0.6s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .card-front {
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          transform: rotateY(0deg);
          opacity: 1;
          z-index: 2;
        }
        
        .card-back {
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2.5rem;
          overflow-y: auto;
          opacity: 0;
          transform: rotateY(-180deg);
          z-index: 1;
        }
        
        .card-flipped .card-front {
          transform: rotateY(180deg);
          opacity: 0;
          z-index: 1;
        }
        
        .card-flipped .card-back {
          transform: rotateY(0deg);
          opacity: 1;
          z-index: 2;
        }
        
        .service-card:hover:not(.card-flipped) .card-front {
          transform: translateY(-10px) rotateY(0deg);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .service-card:not(.card-flipped) .card-front {
          transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.6s;
        }
        
        .quarterly-card-front {
          background: linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%);
          border-top: 5px solid var(--chakra-colors-brand-accent);
        }
        
        .quarterly-card-front::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: radial-gradient(circle at 10px 10px, rgba(0, 123, 255, 0.05) 3px, transparent 4px);
          background-size: 20px 20px;
          opacity: 0.4;
          pointer-events: none;
          border-radius: 12px;
        }
        
        .sixmonth-card-front {
          background: linear-gradient(135deg, #ffffff 0%, #eef7ff 100%);
          border-top: 5px solid var(--chakra-colors-brand-primary);
        }
        
        .sixmonth-card-front::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: linear-gradient(45deg, rgba(0, 60, 120, 0.03) 25%, transparent 25%, transparent 50%, rgba(0, 60, 120, 0.03) 50%, rgba(0, 60, 120, 0.03) 75%, transparent 75%, transparent);
          background-size: 20px 20px;
          opacity: 0.6;
          pointer-events: none;
          border-radius: 12px;
        }
        
        .flip-hint {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: var(--chakra-colors-brand-accent);
          font-weight: 500;
          animation: pulseOpacity 2s infinite;
        }
        
        @keyframes pulseOpacity {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        .back-flip-hint {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          color: var(--chakra-colors-brand-accent);
          font-weight: 500;
          padding: 6px 10px;
          border-radius: 20px;
          background-color: rgba(0, 123, 255, 0.1);
          z-index: 10;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .back-flip-hint:hover {
          background-color: rgba(0, 123, 255, 0.2);
        }
        
        /* About page approach animations */
        .approach-image {
          animation: fadeInScale 0.8s ease-out forwards, float 6s ease-in-out infinite;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          max-width: 100%;
          height: auto;
          filter: drop-shadow(0 5px 15px rgba(0, 123, 255, 0.15));
        }
        
        .approach-image:hover {
          animation: pulse 2s ease-in-out infinite;
          transform: scale(1.05);
          filter: drop-shadow(0 8px 25px rgba(0, 123, 255, 0.25));
        }
        
        .image-container {
          margin-bottom: 24px;
          border-radius: 12px;
          overflow: hidden;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .image-container:hover {
          animation: glow 2s ease-in-out infinite;
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.1); }
          50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.3); }
          100% { box-shadow: 0 0 5px rgba(0, 123, 255, 0.1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .approach-box:nth-of-type(1) .image-container {
          animation-delay: 0.2s;
        }
        
        .approach-box:nth-of-type(2) .image-container {
          animation-delay: 0.4s;
        }
        
        .approach-box:nth-of-type(3) .image-container {
          animation-delay: 0.6s;
        }
        
        .watermark-number {
          position: absolute;
          font-size: 220px;
          font-weight: bold;
          opacity: 0.12;
          color: var(--chakra-colors-brand-accent);
          z-index: 0;
          line-height: 0.8;
          font-family: var(--chakra-fonts-heading);
          pointer-events: none;
          top: 50%;
          left: 80%;
          transform: translate(-50%, -50%);
          overflow: hidden;
        }
        
        @media (max-width: 1024px) {
          .watermark-number {
            font-size: 180px;
          }
        }
        
        @media (max-width: 768px) {
          .watermark-number {
            font-size: 150px;
            left: 75%;
          }
        }
      `}</style>
      {children}
    </>
  );
};

/**
 * Animated Box component with built-in animation classes
 */
interface AnimatedBoxProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'fadeInScale' | 'pulse';
  delay?: number;
  className?: string;
  [key: string]: any;
}

export const AnimatedBox: React.FC<AnimatedBoxProps> = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0,
  className = '',
  ...props 
}) => {
  const animationClass = animation ? `animation-${animation}` : '';
  const style = delay > 0 ? { animationDelay: `${delay}ms` } : undefined;
  
  return (
    <Box 
      className={`${animationClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Fade transition component for smooth page transitions
 */
interface FadeTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  duration?: number;
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({ 
  children, 
  isVisible, 
  duration = 300 
}) => {
  return (
    <Box
      opacity={isVisible ? 1 : 0}
      transition={`opacity ${duration}ms ease-in-out`}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      {children}
    </Box>
  );
};