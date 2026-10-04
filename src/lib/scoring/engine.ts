import { ActivityType, IntentLevel } from "@prisma/client";

export interface ScoreFactor {
  name: string;
  points: number;
  category: "person" | "company" | "behavior" | "recency" | "negative";
  description?: string;
}

export interface CustomThresholds {
  coldMax: number;
  lowMax: number;
  warmMax: number;
  highMax: number;
  hotMin: number;
}

export function validateCustomThresholds(thresholds?: CustomThresholds | null): {
  valid: boolean;
  thresholds: CustomThresholds;
  error?: string;
} {
  const defaultThresholds: CustomThresholds = {
    coldMax: 29,
    lowMax: 49,
    warmMax: 69,
    highMax: 84,
    hotMin: 85,
  };

  if (!thresholds) {
    return { valid: true, thresholds: defaultThresholds };
  }

  const { coldMax, lowMax, warmMax, highMax, hotMin } = thresholds;

  if (
    typeof coldMax !== "number" ||
    typeof lowMax !== "number" ||
    typeof warmMax !== "number" ||
    typeof highMax !== "number" ||
    typeof hotMin !== "number" ||
    Number.isNaN(coldMax) ||
    Number.isNaN(lowMax) ||
    Number.isNaN(warmMax) ||
    Number.isNaN(highMax) ||
    Number.isNaN(hotMin)
  ) {
    return {
      valid: false,
      thresholds: defaultThresholds,
      error: "Threshold values must all be numeric",
    };
  }

  if (
    coldMax < 0 ||
    coldMax >= lowMax ||
    lowMax >= warmMax ||
    warmMax >= highMax ||
    highMax >= hotMin ||
    hotMin > 100
  ) {
    return {
      valid: false,
      thresholds: defaultThresholds,
      error: "Thresholds must satisfy: 0 <= coldMax < lowMax < warmMax < highMax < hotMin <= 100",
    };
  }

  return { valid: true, thresholds };
}

export interface ScoringInput {
  title?: string | null;
  department?: string | null;
  companySize?: string | null;
  industry?: string | null;
  activities: Array<{
    type: ActivityType;
    createdAt: Date;
    title?: string;
    description?: string | null;
  }>;
  customThresholds?: CustomThresholds;
}

export interface ScoreResult {
  score: number;
  intentLevel: IntentLevel;
  positiveFactors: ScoreFactor[];
  negativeFactors: ScoreFactor[];
  scoreChange7d: number;
  activityVelocity7d: number;
  explanation: string;
  /** Heuristic signal coverage ratio measuring corroborating evidence (0.0 to 1.0) */
  evidenceStrength: number;
}

export function calculateLeadScore(input: ScoringInput): ScoreResult {
  const positiveFactors: ScoreFactor[] = [];
  const negativeFactors: ScoreFactor[] = [];
  let baseScore = 20; // baseline starting score

  const now = Date.now();
  const oneDay = 24 * 3600 * 1000;
  const sevenDays = 7 * oneDay;
  const fourteenDays = 14 * oneDay;
  const thirtyDays = 30 * oneDay;

  // 1. Person Factors (Title & Seniority)
  const title = (input.title || "").toLowerCase();
  if (
    title.includes("chief") ||
    title.includes("cto") ||
    title.includes("cio") ||
    title.includes("ciso") ||
    title.includes("ceo") ||
    title.includes("vp") ||
    title.includes("vice president")
  ) {
    const pts = 15;
    baseScore += pts;
    positiveFactors.push({
      name: "Executive / VP decision-maker",
      points: pts,
      category: "person",
      description: `Target title (${input.title}) indicates high budget and purchase authority.`,
    });
  } else if (
    title.includes("director") ||
    title.includes("head of") ||
    title.includes("lead") ||
    title.includes("architect")
  ) {
    const pts = 10;
    baseScore += pts;
    positiveFactors.push({
      name: "Senior Technical / Department Lead",
      points: pts,
      category: "person",
      description: `Role (${input.title}) influences technical solution evaluations.`,
    });
  } else if (title.includes("manager") || title.includes("engineer")) {
    const pts = 5;
    baseScore += pts;
    positiveFactors.push({
      name: "Technical Practitioner Match",
      points: pts,
      category: "person",
    });
  }

  // 2. Company Attributes
  const size = input.companySize || "";
  if (size.includes("500") || size.includes("1000") || size.includes("2500") || size.includes("5000")) {
    const pts = 12;
    baseScore += pts;
    positiveFactors.push({
      name: "Enterprise Company Scale",
      points: pts,
      category: "company",
      description: `Large company size (${size}) fits ideal enterprise ACV target.`,
    });
  } else if (size.includes("100") || size.includes("250")) {
    const pts = 8;
    baseScore += pts;
    positiveFactors.push({
      name: "Mid-Market Growth Fit",
      points: pts,
      category: "company",
    });
  }

  // 3. Behavioral Activity Analysis
  let pricingViews = 0;
  let demoVisits = 0;
  let docsViews = 0;
  let emailOpens = 0;
  let emailClicks = 0;
  let emailReplies = 0;
  let githubStars = 0;
  let executiveHires = 0;
  let recent7dCount = 0;
  let oldestActivityDate = now;
  let newestActivityDate = 0;

  for (const act of input.activities) {
    const actTime = new Date(act.createdAt).getTime();
    if (actTime < oldestActivityDate) oldestActivityDate = actTime;
    if (actTime > newestActivityDate) newestActivityDate = actTime;

    if (now - actTime <= sevenDays) {
      recent7dCount++;
    }

    const titleLower = (act.title || "").toLowerCase();
    const descLower = (act.description || "").toLowerCase();
    if (titleLower.includes("github") || descLower.includes("github") || descLower.includes("starred")) {
      githubStars++;
    }
    if (titleLower.includes("executive hire") || descLower.includes("executive hire") || descLower.includes("leadership")) {
      executiveHires++;
    }

    switch (act.type) {
      case ActivityType.PRICING_VISIT:
        pricingViews++;
        break;
      case ActivityType.DEMO_VISIT:
        demoVisits++;
        break;
      case ActivityType.DOCS_VIEW:
        docsViews++;
        break;
      case ActivityType.EMAIL_OPEN:
        emailOpens++;
        break;
      case ActivityType.EMAIL_CLICK:
        emailClicks++;
        break;
      case ActivityType.EMAIL_REPLY:
        emailReplies++;
        break;
      case ActivityType.GITHUB_STAR:
        githubStars++;
        break;
      case ActivityType.EXECUTIVE_HIRE:
        executiveHires++;
        break;
      default:
        break;
    }
  }

  // Behavioral scoring logic
  if (demoVisits > 0) {
    const pts = Math.min(25, 20 + demoVisits * 5);
    baseScore += pts;
    positiveFactors.push({
      name: "Requested Product Demo",
      points: pts,
      category: "behavior",
      description: "Direct explicit buying signal.",
    });
  }

  if (pricingViews > 0) {
    const pts = Math.min(22, 14 + (pricingViews - 1) * 4);
    baseScore += pts;
    positiveFactors.push({
      name: `Repeated Pricing Page Visits (${pricingViews}x)`,
      points: pts,
      category: "behavior",
      description: "Active evaluation of plan tiers and commercial terms.",
    });
  }

  if (docsViews > 0) {
    const pts = Math.min(15, 8 + docsViews * 3);
    baseScore += pts;
    positiveFactors.push({
      name: `Technical Documentation & API Views (${docsViews}x)`,
      points: pts,
      category: "behavior",
      description: "Assessing implementation feasibility and tenant isolation.",
    });
  }

  if (githubStars > 0) {
    const pts = 8;
    baseScore += pts;
    positiveFactors.push({
      name: "GitHub Repository Star",
      points: pts,
      category: "behavior",
      description: "Developer-led organic adoption and open-source tooling engagement.",
    });
  }

  if (executiveHires > 0) {
    const pts = 15;
    baseScore += pts;
    positiveFactors.push({
      name: "Executive Leadership Expansion",
      points: pts,
      category: "company",
      description: "Leadership hiring signals organizational budget surge and active strategic initiatives.",
    });
  }

  if (emailReplies > 0) {
    const pts = 18;
    baseScore += pts;
    positiveFactors.push({
      name: "Active Email Reply",
      points: pts,
      category: "behavior",
      description: "Two-way conversation established.",
    });
  } else if (emailClicks > 0) {
    const pts = Math.min(12, 6 + emailClicks * 3);
    baseScore += pts;
    positiveFactors.push({
      name: `Email Engagement (${emailClicks} link clicks)`,
      points: pts,
      category: "behavior",
    });
  } else if (emailOpens >= 2) {
    const pts = 6;
    baseScore += pts;
    positiveFactors.push({
      name: `Multiple Sequence Opens (${emailOpens}x)`,
      points: pts,
      category: "behavior",
    });
  }

  // Recency bonus / penalty
  const daysSinceLatest = newestActivityDate > 0 ? (now - newestActivityDate) / oneDay : 999;

  if (daysSinceLatest <= 2 && (pricingViews > 0 || demoVisits > 0 || docsViews > 0)) {
    const pts = 8;
    baseScore += pts;
    positiveFactors.push({
      name: "Immediate Velocity (Active within 48h)",
      points: pts,
      category: "recency",
    });
  } else if (daysSinceLatest > 30) {
    const pts = -16;
    baseScore += pts;
    negativeFactors.push({
      name: "Prolonged Inactivity (30+ days)",
      points: pts,
      category: "negative",
      description: "Lead momentum has stalled; re-engagement required.",
    });
  } else if (daysSinceLatest > 14) {
    const pts = -8;
    baseScore += pts;
    negativeFactors.push({
      name: "Cooling Activity (14+ days)",
      points: pts,
      category: "negative",
      description: "No recent web visits or email engagement recorded.",
    });
  }

  // Normalize score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

  // Intent thresholds (Validated strictly: 0 <= coldMax < lowMax < warmMax < highMax < hotMin <= 100)
  const { thresholds } = validateCustomThresholds(input.customThresholds);

  let intentLevel: IntentLevel = IntentLevel.COLD;
  if (finalScore >= thresholds.hotMin) {
    intentLevel = IntentLevel.HOT;
  } else if (finalScore >= thresholds.warmMax + 1) {
    intentLevel = IntentLevel.HIGH;
  } else if (finalScore >= thresholds.lowMax + 1) {
    intentLevel = IntentLevel.WARM;
  } else if (finalScore >= thresholds.coldMax + 1) {
    intentLevel = IntentLevel.LOW;
  }

  // 7-day activity velocity heuristic (recent interaction burst weight)
  const activityVelocity7d = Math.round(recent7dCount * 4 + (daysSinceLatest <= 2 ? 6 : -3));

  // Plain language explanation
  let explanation = "";
  if (finalScore >= 85) {
    explanation = `${input.title || "The prospect"} exhibits immediate purchase velocity. The strongest drivers are ${positiveFactors.slice(0, 2).map((f) => f.name.toLowerCase()).join(" and ")}. Contacting within 2 hours is strongly advised.`;
  } else if (finalScore >= 70) {
    explanation = `High-intent account with positive evaluation markers. Key interest observed in ${positiveFactors.slice(0, 2).map((f) => f.name.toLowerCase()).join(" and ")}. Recommended for executive follow-up.`;
  } else if (finalScore >= 50) {
    explanation = `Moderate engagement detected. The account has interacted with nurture content but has not yet exhibited deep pricing or architectural commitment.`;
  } else {
    explanation = `Low intent or cold prospect. Limited interaction signals detected. Recommended for automated drip nurture rather than direct sales rep outreach.`;
  }

  // Evidence coverage score: reflects coverage of corroborating signals (heuristic, not black-box probability)
  const evidenceStrength = Number(Math.min(0.98, Math.max(0.65, 0.7 + positiveFactors.length * 0.05)).toFixed(2));

  return {
    score: finalScore,
    intentLevel,
    positiveFactors,
    negativeFactors,
    scoreChange7d: activityVelocity7d,
    activityVelocity7d,
    explanation,
    evidenceStrength,
  };
}
