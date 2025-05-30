// filepath: src/components/common/PageTransition.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useTheme } from '@/providers/ThemeProvider';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const { enableAnimations } = useTheme();

  // If animations are disabled, render children without transitions
  if (!enableAnimations) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.3,
      }}
    >
      {children}
    </motion.div>
  );
}

// Component for animating elements on a page
export function AnimateElement({
  children,
  delay = 0,
  duration = 0.5,
  animation = 'fade',
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  animation?:
    | 'fade'
    | 'slide-up'
    | 'slide-in'
    | 'scale'
    | 'fade-right'
    | 'fade-left'
    | 'fade-down';
  className?: string;
}) {
  const { enableAnimations } = useTheme();

  // Return children directly if animations are disabled
  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  // Define animations
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    'slide-up': {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    'slide-in': {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 },
    },
    'fade-right': {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    'fade-left': {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    'fade-down': {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
  };

  // Default to fade animation if the specified animation doesn't exist
  const animationProps = animations[animation] || animations.fade;
  return (
    <motion.div
      initial={animationProps.initial}
      animate={animationProps.animate}
      exit={animationProps.exit}
      transition={{
        delay,
        duration,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
