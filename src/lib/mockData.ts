import { prisma } from "@/lib/prisma";

export const MOCK_OWNERS = [
  {
    id: "user-1",
    name: "Alex Morgan",
    email: "alex@signalflow.io",
    role: "SALES_REP",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "user-2",
    name: "David Kim",
    email: "david@signalflow.io",
    role: "SALES_REP",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
];

export const MOCK_CONTACTS: any[] = [
  {
    id: "cont-1",
    companyId: "comp-1",
    firstName: "Sarah",
    lastName: "Chen",
    name: "Sarah Chen",
    email: "sarah.chen@acmetech.io",
    title: "VP of Engineering",
    department: "Engineering",
    phone: "+1 (415) 892-3401",
    linkedinUrl: "https://linkedin.com/in/sarah-chen-eng",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company: { name: "Acme Technologies", domain: "acmetech.io" },
    leads: [],
  },
  {
    id: "cont-2",
    companyId: "comp-2",
    firstName: "Marcus",
    lastName: "Vance",
    name: "Marcus Vance",
    email: "m.vance@apexcloud.dev",
    title: "Chief Technology Officer",
    department: "Executive",
    phone: "+1 (206) 441-9022",
    linkedinUrl: "https://linkedin.com/in/marcus-vance-cto",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company: { name: "ApexCloud Platforms", domain: "apexcloud.dev" },
    leads: [],
  },
  {
    id: "cont-3",
    companyId: "comp-3",
    firstName: "Victor",
    lastName: "Stone",
    name: "Victor Stone",
    email: "vstone@securityzero.com",
    title: "Chief Information Officer",
    department: "Security",
    phone: "+1 (512) 670-4491",
    linkedinUrl: "https://linkedin.com/in/victor-stone-cio",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company: { name: "SecurityZero Corp", domain: "securityzero.com" },
    leads: [],
  },
  {
    id: "cont-4",
    companyId: "comp-4",
    firstName: "Elena",
    lastName: "Rostova",
    name: "Elena Rostova",
    email: "elena@datascale.ai",
    title: "Head of Infrastructure",
    department: "Infrastructure",
    phone: "+1 (416) 901-2244",
    linkedinUrl: "https://linkedin.com/in/elena-rostova",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company: { name: "DataScale Analytics", domain: "datascale.ai" },
    leads: [],
  },
  {
    id: "cont-5",
    companyId: "comp-5",
    firstName: "Alexander",
    lastName: "Wright",
    name: "Alexander Wright",
    email: "awright@finpulse.io",
    title: "VP of Digital Operations",
    department: "Operations",
    phone: "+44 20 7946 0912",
    linkedinUrl: "https://linkedin.com/in/awright-fin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company: { name: "FinPulse Global", domain: "finpulse.io" },
    leads: [],
  },
];

export const MOCK_LEADS: any[] = [
  {
    id: "lead-1",
    workspaceId: "ws-default",
    companyId: "comp-1",
    contactId: "cont-1",
    ownerId: "user-1",
    title: "VP of Engineering",
    score: 94,
    stage: "QUALIFIED",
    intent: "HOT",
    dealValue: 78000,
    source: "INBOUND_PRODUCT",
    notes: "High intent: Enterprise pricing page visited 3x, docs read, engaged with sequence.",
    company: {
      id: "comp-1",
      name: "Acme Technologies",
      domain: "acmetech.io",
      contacts: [MOCK_CONTACTS[0]],
      industry: "Enterprise SaaS",
      size: "450",
    },
    contact: MOCK_CONTACTS[0],
    owner: MOCK_OWNERS[0],
    leadScore: {
      id: "ls-1",
      leadId: "lead-1",
      totalScore: 94,
      fitScore: 45,
      intentScore: 49,
      factors: [
        { name: "Executive VP Seniority", weight: "+20" },
        { name: "Enterprise Pricing 3x visits", weight: "+18" },
        { name: "Team active in Webhook API docs", weight: "+15" },
        { name: "ICP Match: $65M Rev & 450 headcount", weight: "+22" },
      ],
      insights: "Immediate outreach recommended. Target 20m architecture sandbox preview.",
      updatedAt: new Date().toISOString(),
    },
    scoreEvents: [
      { id: "se-1", eventType: "PRICING_VISIT", pointChange: 18, reason: "Enterprise Pricing 3x", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { id: "se-2", eventType: "DOCS_VIEW", pointChange: 15, reason: "API Webhook Docs Read", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    ],
    activities: [
      { id: "act-1", type: "PRICING_VISIT", description: "Visited Enterprise Pricing page (3x)", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { id: "act-2", type: "DOCS_VIEW", description: "Explored Webhooks and API Rate limits", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
      { id: "act-3", type: "EMAIL_REPLY", description: "Replied to outbound touchpoint #1", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    ],
    enrollments: [],
    tags: [{ id: "tag-1", tag: { id: "t-1", name: "High-Priority" } }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-2",
    workspaceId: "ws-default",
    companyId: "comp-2",
    contactId: "cont-2",
    ownerId: "user-2",
    title: "Chief Technology Officer",
    score: 89,
    stage: "PROPOSAL",
    intent: "HOT",
    dealValue: 125000,
    source: "INBOUND_DEMO",
    notes: "CTO requested direct quote for 50-seat team rollout. Evaluating Q4 switch.",
    company: {
      id: "comp-2",
      name: "ApexCloud Platforms",
      domain: "apexcloud.dev",
      contacts: [MOCK_CONTACTS[1]],
      industry: "Cloud Infrastructure",
      size: "1,200",
    },
    contact: MOCK_CONTACTS[1],
    owner: MOCK_OWNERS[1],
    leadScore: {
      id: "ls-2",
      leadId: "lead-2",
      totalScore: 89,
      fitScore: 48,
      intentScore: 41,
      factors: [
        { name: "C-Level Decision Maker", weight: "+25" },
        { name: "Requested Custom Enterprise Proposal", weight: "+25" },
        { name: "Downloaded SOC2 Security Packet", weight: "+14" },
      ],
      insights: "Deliver high-touch executive follow-up with enterprise security checklist.",
      updatedAt: new Date().toISOString(),
    },
    scoreEvents: [
      { id: "se-3", eventType: "DEMO_REQUEST", pointChange: 25, reason: "Requested Enterprise Demo", createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
    ],
    activities: [
      { id: "act-4", type: "DEMO_VISIT", description: "Submitted direct Enterprise RFP demo form", createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
      { id: "act-5", type: "DOCS_VIEW", description: "Downloaded SOC2 Type II packet", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
    ],
    enrollments: [],
    tags: [{ id: "tag-2", tag: { id: "t-2", name: "Q4-Closing" } }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-3",
    workspaceId: "ws-default",
    companyId: "comp-3",
    contactId: "cont-3",
    ownerId: "user-1",
    title: "Chief Information Officer",
    score: 82,
    stage: "ENGAGED",
    intent: "HIGH",
    dealValue: 92000,
    source: "ORGANIC_SEARCH",
    notes: "Evaluating tenant isolation, SSO/SAML, and compliance audit log capabilities.",
    company: {
      id: "comp-3",
      name: "SecurityZero Corp",
      domain: "securityzero.com",
      contacts: [MOCK_CONTACTS[2]],
      industry: "Cybersecurity",
      size: "820",
    },
    contact: MOCK_CONTACTS[2],
    owner: MOCK_OWNERS[0],
    leadScore: {
      id: "ls-3",
      leadId: "lead-3",
      totalScore: 82,
      fitScore: 44,
      intentScore: 38,
      factors: [
        { name: "CIO Title fit", weight: "+22" },
        { name: "Evaluated SSO and RBAC features", weight: "+15" },
        { name: "Replied: 'Looking for multi-tenant SLA'", weight: "+18" },
      ],
      insights: "Schedule 15-minute compliance briefing with solutions architect.",
      updatedAt: new Date().toISOString(),
    },
    scoreEvents: [],
    activities: [
      { id: "act-6", type: "PAGE_VIEW", description: "Read Security Whitepaper & Encryption keys", createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString() },
      { id: "act-7", type: "EMAIL_OPEN", description: "Opened Technical Architecture Overview", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    ],
    enrollments: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-4",
    workspaceId: "ws-default",
    companyId: "comp-4",
    contactId: "cont-4",
    ownerId: "user-2",
    title: "Head of Infrastructure",
    score: 74,
    stage: "CONTACTED",
    intent: "WARM",
    dealValue: 54000,
    source: "PRODUCT_INVITE",
    notes: "Ingesting signals from trial cluster. Spike in API requests.",
    company: {
      id: "comp-4",
      name: "DataScale Analytics",
      domain: "datascale.ai",
      contacts: [MOCK_CONTACTS[3]],
      industry: "AI & Big Data",
      size: "310",
    },
    contact: MOCK_CONTACTS[3],
    owner: MOCK_OWNERS[1],
    leadScore: {
      id: "ls-4",
      leadId: "lead-4",
      totalScore: 74,
      fitScore: 40,
      intentScore: 34,
      factors: [
        { name: "Head of Infra Seniority", weight: "+18" },
        { name: "Installed SDK in dev staging", weight: "+20" },
      ],
      insights: "Offer developer sandbox credits and invite to technical Slack channel.",
      updatedAt: new Date().toISOString(),
    },
    scoreEvents: [],
    activities: [
      { id: "act-8", type: "PAGE_VIEW", description: "Browsed SDK quickstart tutorial", createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
    ],
    enrollments: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "lead-5",
    workspaceId: "ws-default",
    companyId: "comp-5",
    contactId: "cont-5",
    ownerId: "user-1",
    title: "VP of Digital Operations",
    score: 66,
    stage: "NEW",
    intent: "WARM",
    dealValue: 145000,
    source: "OUTBOUND_SEQUENCE",
    notes: "Financial institution exploring automated revops pipeline.",
    company: {
      id: "comp-5",
      name: "FinPulse Global",
      domain: "finpulse.io",
      contacts: [MOCK_CONTACTS[4]],
      industry: "FinTech & Banking",
      size: "1,950",
    },
    contact: MOCK_CONTACTS[4],
    owner: MOCK_OWNERS[0],
    leadScore: {
      id: "ls-5",
      leadId: "lead-5",
      totalScore: 66,
      fitScore: 42,
      intentScore: 24,
      factors: [
        { name: "Massive ICP: $310M rev company", weight: "+28" },
        { name: "Visited Product Tour page", weight: "+10" },
      ],
      insights: "Enroll in Enterprise FinTech nurture sequence with benchmark studies.",
      updatedAt: new Date().toISOString(),
    },
    scoreEvents: [],
    activities: [
      { id: "act-9", type: "PAGE_VIEW", description: "Checked FinTech case study", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    ],
    enrollments: [],
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_COMPANIES = [
  {
    id: "comp-1",
    name: "Acme Technologies",
    domain: "acmetech.io",
    industry: "Enterprise SaaS",
    employeeCount: 450,
    size: "450",
    intentScore: 94,
    aiSummary: "Rapidly expanding product team evaluating AI signal engines for 45 sales reps.",
    annualRevenue: "$65M",
    country: "United States",
    city: "San Francisco",
    location: "San Francisco, CA",
    techStack: ["Kubernetes", "Next.js", "PostgreSQL", "Datadog"],
    contacts: [MOCK_CONTACTS[0]],
    leads: [MOCK_LEADS[0]],
    activities: MOCK_LEADS[0].activities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comp-2",
    name: "ApexCloud Platforms",
    domain: "apexcloud.dev",
    industry: "Cloud Infrastructure",
    employeeCount: 1200,
    size: "1,200",
    intentScore: 89,
    aiSummary: "CTO submitted RFP demo. Seeking unified intent signals to replace legacy CRM plugins.",
    annualRevenue: "$180M",
    country: "United States",
    city: "Seattle",
    location: "Seattle, WA",
    techStack: ["AWS", "Snowflake", "Terraform", "Kafka"],
    contacts: [MOCK_CONTACTS[1]],
    leads: [MOCK_LEADS[1]],
    activities: MOCK_LEADS[1].activities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comp-3",
    name: "SecurityZero Corp",
    domain: "securityzero.com",
    industry: "Cybersecurity",
    employeeCount: 820,
    size: "820",
    intentScore: 82,
    aiSummary: "CIO reviewing enterprise data isolation, SAML SSO, and SOC2 audit compliance.",
    annualRevenue: "$95M",
    country: "United States",
    city: "Austin",
    location: "Austin, TX",
    techStack: ["Okta", "Splunk", "CrowdStrike", "Go"],
    contacts: [MOCK_CONTACTS[2]],
    leads: [MOCK_LEADS[2]],
    activities: MOCK_LEADS[2].activities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comp-4",
    name: "DataScale Analytics",
    domain: "datascale.ai",
    industry: "AI & Big Data",
    employeeCount: 310,
    size: "310",
    intentScore: 74,
    aiSummary: "Active developers testing API endpoints and docs. Preparing data pipeline integration.",
    annualRevenue: "$42M",
    country: "Canada",
    city: "Toronto",
    location: "Toronto, Canada",
    techStack: ["PyTorch", "GCP BigQuery", "Ray", "ClickHouse"],
    contacts: [MOCK_CONTACTS[3]],
    leads: [MOCK_LEADS[3]],
    activities: MOCK_LEADS[3].activities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "comp-5",
    name: "FinPulse Global",
    domain: "finpulse.io",
    industry: "FinTech & Banking",
    employeeCount: 1950,
    size: "1,950",
    intentScore: 66,
    aiSummary: "High-value enterprise target assessing lead score accuracy and cadence safety controls.",
    annualRevenue: "$310M",
    country: "United Kingdom",
    city: "London",
    location: "London, UK",
    techStack: ["Stripe", "Java", "Docker", "Redis"],
    contacts: [MOCK_CONTACTS[4]],
    leads: [MOCK_LEADS[4]],
    activities: MOCK_LEADS[4].activities,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_AUTOMATIONS = [
  {
    id: "auto-1",
    name: "Instant Hot Lead Routing & Slack Ping",
    description: "When score >= 85 and intent is HOT, assign immediately to AE and send high-priority Slack ping.",
    triggerType: "SCORE_THRESHOLD",
    triggerConfig: { minScore: 85, intent: "HOT" },
    actionType: "SLACK_AND_ASSIGN",
    actionConfig: { channel: "#sales-hot-leads", priority: "URGENT" },
    isActive: true,
    executionCount: 1420,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "auto-2",
    name: "Auto-Stop Sequences on Reply Detection",
    description: "Instantly halt all multi-touch cadence emails across all reps when a prospect sends a reply or books a meeting.",
    triggerType: "EMAIL_REPLY_RECEIVED",
    triggerConfig: { anySender: true },
    actionType: "HALT_SEQUENCE",
    actionConfig: { updateStatus: "PAUSED_REPLIED" },
    isActive: true,
    executionCount: 890,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "auto-3",
    name: "Enterprise Pricing Surge Alert",
    description: "Detect when 2+ visitors from the same domain view the pricing page within 24 hours.",
    triggerType: "DOMAIN_VELOCITY",
    triggerConfig: { page: "/pricing", minVisits: 2, timeframeHours: 24 },
    actionType: "NOTIFY_ACCOUNT_OWNER",
    actionConfig: { boostScore: 18 },
    isActive: true,
    executionCount: 512,
    lastRunAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_SEQUENCES = [
  {
    id: "seq-1",
    name: "Enterprise Architecture Review Cadence",
    description: "4-step consultative outreach for technical decision makers exploring docs and API endpoints.",
    status: "ACTIVE",
    steps: [
      { id: "step-1", stepOrder: 1, delayDays: 0, subject: "Quick question on {{company}}'s API architecture", type: "EMAIL" },
      { id: "step-2", stepOrder: 2, delayDays: 2, subject: "Custom benchmark: Scalability & latency metrics", type: "EMAIL" },
      { id: "step-3", stepOrder: 3, delayDays: 5, subject: "Architecture review with our founding engineer?", type: "EMAIL" },
      { id: "step-4", stepOrder: 4, delayDays: 8, subject: "Closing loop / sandbox workspace access", type: "EMAIL" },
    ],
    enrollments: [
      { id: "en-1", leadId: "lead-1", status: "ACTIVE", currentStep: 1 },
      { id: "en-2", leadId: "lead-3", status: "COMPLETED", currentStep: 4 },
    ],
    openRate: 0.68,
    clickRate: 0.34,
    replyRate: 0.22,
    enrolledCount: 312,
    stats: { enrolled: 312, opened: 248, replied: 64, converted: 28 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seq-2",
    name: "High-Intent Demo Follow-Up Protocol",
    description: "Rapid 15-minute response sequence for visitors who requested a live walkthrough.",
    status: "ACTIVE",
    steps: [
      { id: "step-5", stepOrder: 1, delayDays: 0, subject: "Your SignalFlow sandbox is ready (+ agenda)", type: "EMAIL" },
      { id: "step-6", stepOrder: 2, delayDays: 1, subject: "Confirmed: Meeting invite and calendar link", type: "EMAIL" },
      { id: "step-7", stepOrder: 3, delayDays: 3, subject: "3 features our enterprise clients use first", type: "EMAIL" },
    ],
    enrollments: [
      { id: "en-3", leadId: "lead-2", status: "ACTIVE", currentStep: 2 },
    ],
    openRate: 0.79,
    clickRate: 0.46,
    replyRate: 0.31,
    enrolledCount: 180,
    stats: { enrolled: 180, opened: 165, replied: 82, converted: 51 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let dbAvailable: boolean | null = null;
let lastDbCheck = 0;

async function isDatabaseReachable(): Promise<boolean> {
  const now = Date.now();
  if (dbAvailable !== null && now - lastDbCheck < 60000) {
    return dbAvailable;
  }
  try {
    const probe = prisma.$queryRaw`SELECT 1`;
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB_PROBE_TIMEOUT")), 150)
    );
    await Promise.race([probe, timeout]);
    dbAvailable = true;
    lastDbCheck = now;
    return true;
  } catch {
    dbAvailable = false;
    lastDbCheck = now;
    return false;
  }
}

/** Safe database getter helpers with multi-tenant workspace isolation */
export async function getLeadsSafe(workspaceId?: string) {
  const dbOk = await isDatabaseReachable();
  if (dbOk) {
    try {
      const where: any = { deletedAt: null };
      if (workspaceId) where.workspaceId = workspaceId;

      const leads = await prisma.lead.findMany({
        where,
        orderBy: { score: "desc" },
        include: {
          company: true,
          contact: true,
          owner: true,
          leadScore: true,
          activities: { take: 5, orderBy: { createdAt: "desc" } },
        },
      });
      return leads;
    } catch (e) {
      console.error("Database query failed in getLeadsSafe:", e);
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    return MOCK_LEADS;
  }
  return [];
}

export async function getLeadByIdSafe(id: string, workspaceId?: string) {
  const dbOk = await isDatabaseReachable();
  if (dbOk) {
    try {
      const where: any = { id, deletedAt: null };
      if (workspaceId) where.workspaceId = workspaceId;

      const lead = await prisma.lead.findFirst({
        where,
        include: {
          company: { include: { contacts: true } },
          contact: true,
          owner: true,
          leadScore: true,
          scoreEvents: { orderBy: { createdAt: "desc" } },
          activities: { orderBy: { createdAt: "desc" } },
          enrollments: { include: { sequence: true } },
          tags: { include: { tag: true } },
        },
      });
      if (lead) return lead;
    } catch (e) {
      console.error("Database query failed in getLeadByIdSafe:", e);
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    const matched = MOCK_LEADS.find((l) => l.id === id);
    return matched || null;
  }
  return null;
}

export async function getCompaniesSafe(workspaceId?: string) {
  const dbOk = await isDatabaseReachable();
  if (dbOk) {
    try {
      const where = workspaceId ? { workspaceId } : {};
      const companies = await prisma.company.findMany({
        where,
        include: { leads: true, contacts: true },
        orderBy: { name: "asc" },
      });
      return companies;
    } catch (e) {
      console.error("Database query failed in getCompaniesSafe:", e);
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    return MOCK_COMPANIES;
  }
  return [];
}

export async function getCompanyByIdSafe(id: string, workspaceId?: string) {
  const dbOk = await isDatabaseReachable();
  if (dbOk) {
    try {
      const where: any = { id };
      if (workspaceId) where.workspaceId = workspaceId;

      const company = await prisma.company.findFirst({
        where,
        include: {
          contacts: true,
          leads: { include: { contact: true, owner: true } },
          activities: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      });
      if (company) return company;
    } catch (e) {
      console.error("Database query failed in getCompanyByIdSafe:", e);
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    const matched = MOCK_COMPANIES.find((c) => c.id === id);
    return matched || null;
  }
  return null;
}

export async function getContactsSafe(workspaceId?: string) {
  const dbOk = await isDatabaseReachable();
  if (dbOk) {
    try {
      const where = workspaceId ? { workspaceId } : {};
      const contacts = await prisma.contact.findMany({
        where,
        include: { company: true },
        orderBy: { firstName: "asc" },
      });
      return contacts;
    } catch (e) {
      console.error("Database query failed in getContactsSafe:", e);
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    return MOCK_CONTACTS;
  }
  return [];
}

export async function getAutomationsSafe(workspaceId?: string) {
  const dbOk = await isDatabaseReachable();
  if (dbOk) {
    try {
      const where = workspaceId ? { workspaceId } : {};
      const automations = await prisma.automation.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      return automations;
    } catch (e) {
      console.error("Database query failed in getAutomationsSafe:", e);
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    return MOCK_AUTOMATIONS;
  }
  return [];
}

export async function getSequencesSafe(workspaceId?: string) {
  const dbOk = await isDatabaseReachable();
  if (dbOk) {
    try {
      const where = workspaceId ? { workspaceId } : {};
      const sequences = await prisma.sequence.findMany({
        where,
        include: {
          steps: { orderBy: { stepOrder: "asc" } },
          enrollments: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return sequences;
    } catch (e) {
      console.error("Database query failed in getSequencesSafe:", e);
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE === "true") {
    return MOCK_SEQUENCES;
  }
  return [];
}

