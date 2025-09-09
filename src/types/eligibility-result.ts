export interface EligibilityResult {
  isEligible: boolean;
  score: number; // 0-100
  primarySignal: number; // 0-100 (most important)
  secondarySignal: number; // 0-100 (tie-breaker)
  reasons: string[];
  strategyScores: {
    // Primary strategy scores
    'delivery-speed': number;
    'environmental-impact': number;
    'cost-efficiency': number;
    // Secondary strategy scores
    'weight-efficiency': number;
    'dimension-efficiency': number;
    'capacity-utilization': number;
  };
}
