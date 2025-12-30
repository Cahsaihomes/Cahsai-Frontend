// Admin Dashboard Animations
export const animationStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Animation Classes */
  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.6s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.6s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  .animate-pulse-custom {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Staggered KPI Cards */
  .kpi-card-0 {
    animation-delay: 0s;
  }

  .kpi-card-1 {
    animation-delay: 0.1s;
  }

  .kpi-card-2 {
    animation-delay: 0.2s;
  }

  .kpi-card-3 {
    animation-delay: 0.3s;
  }

  .kpi-card-4 {
    animation-delay: 0.4s;
  }

  /* Staggered Chart Cards */
  .chart-card-0 {
    animation-delay: 0.4s;
  }

  .chart-card-1 {
    animation-delay: 0.5s;
  }

  .chart-card-2 {
    animation-delay: 0.6s;
  }

  /* Table and Detail Cards */
  .table-card {
    animation-delay: 0.6s;
  }

  .detail-card {
    animation-delay: 0.5s;
  }

  /* Management Table Rows */
  .table-row-0 {
    animation-delay: 0.7s;
  }

  .table-row-1 {
    animation-delay: 0.75s;
  }

  .table-row-2 {
    animation-delay: 0.8s;
  }

  .table-row-3 {
    animation-delay: 0.85s;
  }

  .table-row-4 {
    animation-delay: 0.9s;
  }

  /* Button Animations */
  .button-hover:hover {
    transform: translateY(-2px);
    transition: all 0.3s ease-out;
  }

  /* Card Hover Effect */
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease-out;
  }

  /* Tab Animation */
  .tab-active::after {
    animation: slideInUp 0.4s ease-out forwards;
  }

  /* Badge Animation */
  .badge-animate {
    animation: scaleIn 0.4s ease-out forwards;
  }
`;

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{animationStyles}</style>
      {children}
    </>
  );
}

export function useAnimationDelay(index: number, baseDelay = 0) {
  return baseDelay + index * 0.05;
}
