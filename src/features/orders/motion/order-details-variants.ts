import type { Variants } from 'framer-motion'

export const orderDetailsEase = [0.25, 0.1, 0.25, 1] as const

export const orderDetailsPageLoadTransition = { duration: 0.4, ease: orderDetailsEase }

export const orderDetailsHeaderVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.36, ease: orderDetailsEase, delay: 0.04 },
  },
}

export const orderDetailsCardsStaggerParentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

export const orderDetailsCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.34, ease: orderDetailsEase },
  },
}

export const orderDetailsItemsStaggerParentVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
}

export const orderDetailsItemRowVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: orderDetailsEase },
  },
}

export const orderDetailsPaymentVariants: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.36, ease: orderDetailsEase, delay: 0.1 },
  },
}

export const orderDetailsDeliveryStatusBodyVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: orderDetailsEase },
  },
}

export const orderDetailsStatusBadgeVariants: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: orderDetailsEase },
  },
}

export const orderDetailsButtonMotionProps = {
  whileHover: { scale: 1.03, transition: { duration: 0.18, ease: 'easeOut' as const } },
  whileTap: { scale: 0.97, transition: { duration: 0.14 } },
}

export const orderDetailsTabSpring = { type: 'spring' as const, stiffness: 420, damping: 34 }
