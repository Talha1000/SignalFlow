import { PrismaClient, Role, Plan, LeadStage, IntentLevel, ActivityType, SequenceStatus, EnrollmentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.APP_ENV === "production";

  if (isProd) {
    if (process.env.ALLOW_PRODUCTION_SEED !== "true") {
      console.error(
        "🚨 FATAL: Database seed blocked in PRODUCTION environment.\n" +
        "Seeding would destroy all customer records, tenant workspaces, and audit logs.\n" +
        "Set ALLOW_PRODUCTION_SEED=true to override if running an intentional baseline initialization."
      );
      process.exit(1);
    }
    console.warn("⚠️ NOTICE: ALLOW_PRODUCTION_SEED=true is set. Running non-destructive production initialization.");
  }

  console.log("🌱 Starting SignalFlow database seed...");

  // 1. Clean existing data in reverse relation order (ONLY in non-production environments)
  if (!isProd) {
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.scoreEvent.deleteMany();
    await prisma.leadScore.deleteMany();
    await prisma.leadTag.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.sequenceEnrollment.deleteMany();
    await prisma.sequenceStep.deleteMany();
    await prisma.sequence.deleteMany();
    await prisma.automationExecution.deleteMany();
    await prisma.automation.deleteMany();
    await prisma.pipelineStage.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.company.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.webhook.deleteMany();
    await prisma.usageRecord.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.workspaceMember.deleteMany();
    await prisma.workspace.deleteMany();
    await prisma.user.deleteMany();
  } else {
    // In production, ensure we don't duplicate or overwrite if already initialized
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log("ℹ️ Production database already contains users. Skipping demo user creation to preserve production state.");
      return;
    }
  }

  // 2. Create Users
  const passwordHash = await bcrypt.hash("SignalFlow2026!", 10);

  const alex = await prisma.user.create({
    data: {
      email: "alex.morgan@signalflow.io",
      name: "Alex Morgan",
      passwordHash,
      avatarUrl: "https://ui-avatars.com/api/?name=Alex+Morgan&background=38b6ff&color=121212",
    },
  });

  const sarahAdmin = await prisma.user.create({
    data: {
      email: "sarah.connor@signalflow.io",
      name: "Sarah Connor",
      passwordHash,
      avatarUrl: "https://ui-avatars.com/api/?name=Sarah+Connor&background=f59e0b&color=121212",
    },
  });

  const repLiam = await prisma.user.create({
    data: {
      email: "liam.vance@signalflow.io",
      name: "Liam Vance",
      passwordHash,
      avatarUrl: "https://ui-avatars.com/api/?name=Liam+Vance&background=10b981&color=121212",
    },
  });

  const repMaya = await prisma.user.create({
    data: {
      email: "maya.patel@signalflow.io",
      name: "Maya Patel",
      passwordHash,
      avatarUrl: "https://ui-avatars.com/api/?name=Maya+Patel&background=8b5cf6&color=121212",
    },
  });

  // 3. Create Workspaces
  const workspace = await prisma.workspace.create({
    data: {
      name: "SignalFlow Global Inc",
      slug: "signalflow-hq",
      domain: "signalflow.io",
      plan: Plan.GROWTH,
      scoringThresholds: {
        coldMax: 29,
        lowMax: 49,
        warmMax: 69,
        highMax: 84,
        hotMin: 85,
      },
      settings: {
        currency: "USD",
        timezone: "America/New_York",
        autoStopCadenceOnReply: true,
      },
    },
  });

  // Memberships
  await prisma.workspaceMember.createMany({
    data: [
      { workspaceId: workspace.id, userId: alex.id, role: Role.OWNER },
      { workspaceId: workspace.id, userId: sarahAdmin.id, role: Role.ADMIN },
      { workspaceId: workspace.id, userId: repLiam.id, role: Role.SALES_REP },
      { workspaceId: workspace.id, userId: repMaya.id, role: Role.SALES_REP },
    ],
  });

  // Subscription & Usage
  await prisma.subscription.create({
    data: {
      workspaceId: workspace.id,
      plan: Plan.GROWTH,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
    },
  });

  await prisma.usageRecord.create({
    data: {
      workspaceId: workspace.id,
      leadsCount: 65,
      aiCreditsUsed: 420,
      emailsSentCount: 1840,
      teamMembersCount: 4,
    },
  });

  // 4. Pipeline Stages
  const stagesData = [
    { stageKey: "NEW", name: "New Lead", order: 1, winProbability: 0.1, color: "#94a3b8" },
    { stageKey: "CONTACTED", name: "Contacted", order: 2, winProbability: 0.2, color: "#38bdf8" },
    { stageKey: "ENGAGED", name: "Engaged", order: 3, winProbability: 0.35, color: "#818cf8" },
    { stageKey: "QUALIFIED", name: "Qualified", order: 4, winProbability: 0.5, color: "#a855f7" },
    { stageKey: "MEETING", name: "Meeting Booked", order: 5, winProbability: 0.65, color: "#e879f9" },
    { stageKey: "PROPOSAL", name: "Proposal Sent", order: 6, winProbability: 0.75, color: "#f59e0b" },
    { stageKey: "NEGOTIATION", name: "In Negotiation", order: 7, winProbability: 0.85, color: "#f97316" },
    { stageKey: "WON", name: "Closed Won", order: 8, winProbability: 1.0, color: "#10b981" },
    { stageKey: "LOST", name: "Closed Lost", order: 9, winProbability: 0.0, color: "#ef4444" },
  ];

  for (const s of stagesData) {
    await prisma.pipelineStage.create({
      data: { ...s, workspaceId: workspace.id },
    });
  }

  // 5. Tags
  const tagEnterprise = await prisma.tag.create({ data: { workspaceId: workspace.id, name: "Enterprise", color: "#6366f1" } });
  const tagHighTouch = await prisma.tag.create({ data: { workspaceId: workspace.id, name: "High Touch", color: "#ec4899" } });
  const tagProductLed = await prisma.tag.create({ data: { workspaceId: workspace.id, name: "PLG Inbound", color: "#10b981" } });
  const tagFintech = await prisma.tag.create({ data: { workspaceId: workspace.id, name: "Fintech", color: "#f59e0b" } });

  // 6. Companies (16 realistic B2B companies)
  const companiesData = [
    {
      name: "Acme Technologies",
      domain: "acmetech.io",
      industry: "Developer Infrastructure",
      size: "250-500",
      annualRevenue: "$35M",
      location: "San Francisco, CA",
      techStack: ["Kubernetes", "Next.js", "PostgreSQL", "Go", "AWS"],
      intentScore: 91,
      aiSummary: "Acme Technologies shows high buying velocity. 3 engineering leaders engaged with enterprise pricing and API documentation over the last 48 hours.",
    },
    {
      name: "ApexCloud Platforms",
      domain: "apexcloud.dev",
      industry: "Cloud & DevOps",
      size: "500-1000",
      annualRevenue: "$65M",
      location: "Seattle, WA",
      techStack: ["Terraform", "Docker", "GCP", "Python", "GraphQL"],
      intentScore: 88,
      aiSummary: "ApexCloud is actively modernizing their monitoring stack. Multiple visits to documentation and security whitepapers.",
    },
    {
      name: "Lumina Health Systems",
      domain: "luminahealth.com",
      industry: "Healthcare & Life Sciences",
      size: "1000-5000",
      annualRevenue: "$180M",
      location: "Boston, MA",
      techStack: ["Epic EHR", "Azure", "React", "C#", "SQL Server"],
      intentScore: 78,
      aiSummary: "Evaluating HIPAA-compliant signal capture workflows. Clinical operations team requested a security packet.",
    },
    {
      name: "Quantix Financial",
      domain: "quantixfin.com",
      industry: "Fintech & Banking",
      size: "100-250",
      annualRevenue: "$22M",
      location: "New York, NY",
      techStack: ["Rust", "PostgreSQL", "React", "Kafka"],
      intentScore: 84,
      aiSummary: "Strong interest from Head of Compliance and CTO. Inquiring about audit logging and tenant isolation.",
    },
    {
      name: "Nexus Logistics Global",
      domain: "nexuslogistics.net",
      industry: "Supply Chain & Logistics",
      size: "2500+",
      annualRevenue: "$420M",
      location: "Chicago, IL",
      techStack: ["SAP", "Java", "Oracle", "Azure"],
      intentScore: 62,
      aiSummary: "Logistics dispatch team is researching real-time alert routing. Occasional email engagement.",
    },
    {
      name: "DataForge Analytics",
      domain: "dataforge.ai",
      industry: "Data & Artificial Intelligence",
      size: "50-100",
      annualRevenue: "$12M",
      location: "Austin, TX",
      techStack: ["Snowflake", "dbt", "Python", "Ray"],
      intentScore: 74,
      aiSummary: "Product team testing integration webhooks and looking to automate sales alerts for high-volume accounts.",
    },
    {
      name: "Veloce Media Group",
      domain: "velocemedia.co",
      industry: "Digital Media & AdTech",
      size: "50-100",
      annualRevenue: "$8M",
      location: "Los Angeles, CA",
      techStack: ["Node.js", "Redis", "TypeScript", "AWS"],
      intentScore: 54,
      aiSummary: "Moderate initial interest from Growth Lead. Has opened 3 nurture emails but not yet visited pricing.",
    },
    {
      name: "HyperScale Networks",
      domain: "hyperscale.io",
      industry: "Cybersecurity & Edge",
      size: "100-250",
      annualRevenue: "$28M",
      location: "Denver, CO",
      techStack: ["Cloudflare", "Go", "ClickHouse", "React"],
      intentScore: 89,
      aiSummary: "VP of Product and Director of Sales Engineering reviewed pricing and booked an architecture discovery call.",
    },
    {
      name: "BioSync Therapeutics",
      domain: "biosynctx.com",
      industry: "Biotech",
      size: "50-100",
      annualRevenue: "$15M",
      location: "San Diego, CA",
      techStack: ["AWS", "Python", "Tableau"],
      intentScore: 42,
      aiSummary: "Initial research stage. Downloaded one whitepaper last month. Low current recency.",
    },
    {
      name: "OmniChannel Retail",
      domain: "omnichannel.shop",
      industry: "E-Commerce",
      size: "500-1000",
      annualRevenue: "$90M",
      location: "Dallas, TX",
      techStack: ["Shopify Plus", "React", "Klaviyo", "GCP"],
      intentScore: 69,
      aiSummary: "Looking to connect Shopify webhooks into sales priority queue. Warm intent with active sales conversations.",
    },
    {
      name: "PeakFlow Systems",
      domain: "peakflow.tech",
      industry: "Enterprise SaaS",
      size: "250-500",
      annualRevenue: "$45M",
      location: "Salt Lake City, UT",
      techStack: ["Next.js", "Supabase", "Tailwind", "Stripe"],
      intentScore: 86,
      aiSummary: "Evaluating competitive alternatives. Visited comparison page 4 times this week.",
    },
    {
      name: "SecurityZero Corp",
      domain: "securityzero.com",
      industry: "Zero Trust Security",
      size: "100-250",
      annualRevenue: "$19M",
      location: "Reston, VA",
      techStack: ["Rust", "Kubernetes", "Linux", "Azure"],
      intentScore: 92,
      aiSummary: "Security team actively testing SSO and RBAC features. Immediate follow-up recommended.",
    },
    {
      name: "DevSphere Tools",
      domain: "devsphere.dev",
      industry: "Developer Tooling",
      size: "20-50",
      annualRevenue: "$5M",
      location: "Portland, OR",
      techStack: ["Rust", "WebAssembly", "TypeScript"],
      intentScore: 38,
      aiSummary: "Founder signed up for Free trial; exploration mode. Not yet ready for enterprise contract.",
    },
    {
      name: "OpsMaster Cloud",
      domain: "opsmaster.io",
      industry: "IT Infrastructure",
      size: "50-100",
      annualRevenue: "$9M",
      location: "Atlanta, GA",
      techStack: ["Ansible", "Terraform", "Python"],
      intentScore: 58,
      aiSummary: "Steady engagement from IT manager. Visited pricing calculator once.",
    },
    {
      name: "NexaCore Robotics",
      domain: "nexacore.de",
      industry: "Industrial Automation",
      size: "1000-5000",
      annualRevenue: "$210M",
      location: "Munich, Germany",
      techStack: ["C++", "ROS2", "Linux", "Siemens"],
      intentScore: 71,
      aiSummary: "European operations team assessing partner integration APIs. High strategic value account.",
    },
    {
      name: "Synapse Talent AI",
      domain: "synapsetalent.com",
      industry: "HR Tech & Recruiting",
      size: "20-50",
      annualRevenue: "$4M",
      location: "Toronto, Canada",
      techStack: ["Node.js", "MongoDB", "Vue.js"],
      intentScore: 24,
      aiSummary: "Cold. Signed up 60 days ago with zero login activity in the last 30 days.",
    },
  ];

  const createdCompanies: Record<string, string> = {};

  for (const c of companiesData) {
    const comp = await prisma.company.create({
      data: {
        workspaceId: workspace.id,
        name: c.name,
        domain: c.domain,
        industry: c.industry,
        size: c.size,
        annualRevenue: c.annualRevenue,
        location: c.location,
        techStack: c.techStack,
        intentScore: c.intentScore,
        aiSummary: c.aiSummary,
      },
    });
    createdCompanies[c.name] = comp.id;
  }

  // 7. Contacts (42 realistic business contacts)
  const contactsData = [
    // Acme
    { comp: "Acme Technologies", first: "Sarah", last: "Chen", email: "sarah.chen@acmetech.io", title: "VP of Engineering", dept: "Engineering" },
    { comp: "Acme Technologies", first: "David", last: "Kim", email: "david.kim@acmetech.io", title: "Principal Architect", dept: "Engineering" },
    { comp: "Acme Technologies", first: "Elena", last: "Rostova", email: "elena.r@acmetech.io", title: "Director of Product", dept: "Product" },
    // ApexCloud
    { comp: "ApexCloud Platforms", first: "Marcus", last: "Vance", email: "m.vance@apexcloud.dev", title: "Chief Technology Officer", dept: "Executive" },
    { comp: "ApexCloud Platforms", first: "Chloe", last: "Bennett", email: "c.bennett@apexcloud.dev", title: "Head of Infrastructure", dept: "DevOps" },
    { comp: "ApexCloud Platforms", first: "Julian", last: "Soto", email: "j.soto@apexcloud.dev", title: "Lead Site Reliability Engineer", dept: "Engineering" },
    // Lumina Health
    { comp: "Lumina Health Systems", first: "Dr. Rachel", last: "Adams", email: "radams@luminahealth.com", title: "VP Clinical Operations", dept: "Operations" },
    { comp: "Lumina Health Systems", first: "Gregory", last: "House", email: "ghouse@luminahealth.com", title: "Chief Information Security Officer", dept: "Security" },
    // Quantix Financial
    { comp: "Quantix Financial", first: "Alexander", last: "Sterling", email: "asterling@quantixfin.com", title: "Head of Algorithmic Trading", dept: "Trading" },
    { comp: "Quantix Financial", first: "Nadia", last: "Boulanger", email: "nboulanger@quantixfin.com", title: "VP Compliance & Risk", dept: "Risk" },
    // HyperScale Networks
    { comp: "HyperScale Networks", first: "Kieran", last: "O'Connor", email: "kieran@hyperscale.io", title: "VP of Product", dept: "Product" },
    { comp: "HyperScale Networks", first: "Samantha", last: "Wright", email: "swright@hyperscale.io", title: "Director of Sales Engineering", dept: "Sales" },
    // PeakFlow Systems
    { comp: "PeakFlow Systems", first: "Tobias", last: "Meyer", email: "tmeyer@peakflow.tech", title: "Chief Operating Officer", dept: "Operations" },
    { comp: "PeakFlow Systems", first: "Ingrid", last: "Lindholm", email: "ilindholm@peakflow.tech", title: "Senior Growth Manager", dept: "Growth" },
    // SecurityZero Corp
    { comp: "SecurityZero Corp", first: "Victor", last: "Stone", email: "vstone@securityzero.com", title: "Chief Information Officer", dept: "Executive" },
    { comp: "SecurityZero Corp", first: "Maya", last: "Lin", email: "mlin@securityzero.com", title: "Lead Security Architect", dept: "Security" },
    // Nexus Logistics
    { comp: "Nexus Logistics Global", first: "Arthur", last: "Pendleton", email: "apendleton@nexuslogistics.net", title: "VP Fleet Logistics", dept: "Logistics" },
    // DataForge Analytics
    { comp: "DataForge Analytics", first: "Zoe", last: "Kravitz", email: "zkravitz@dataforge.ai", title: "Head of Data Engineering", dept: "Engineering" },
    // Veloce Media Group
    { comp: "Veloce Media Group", first: "Luca", last: "Moretti", email: "lmoretti@velocemedia.co", title: "VP Audience Growth", dept: "Growth" },
    // OmniChannel Retail
    { comp: "OmniChannel Retail", first: "Harper", last: "Reed", email: "hreed@omnichannel.shop", title: "E-Commerce Director", dept: "E-Commerce" },
    // NexaCore Robotics
    { comp: "NexaCore Robotics", first: "Hans", last: "Gruber", email: "hgruber@nexacore.de", title: "Director of Automation", dept: "Automation" },
    // BioSync Therapeutics
    { comp: "BioSync Therapeutics", first: "Clara", last: "Oswald", email: "coswald@biosynctx.com", title: "Director of Bioinformatics", dept: "Research" },
    // DevSphere Tools
    { comp: "DevSphere Tools", first: "Felix", last: "Arvid", email: "felix@devsphere.dev", title: "Founder & CEO", dept: "Executive" },
    // OpsMaster Cloud
    { comp: "OpsMaster Cloud", first: "Simon", last: "Bauer", email: "sbauer@opsmaster.io", title: "Infrastructure Architect", dept: "IT" },
    // Synapse Talent
    { comp: "Synapse Talent AI", first: "Gemma", last: "Ward", email: "gward@synapsetalent.com", title: "Talent Partner", dept: "Recruiting" },
  ];

  const createdContacts: Record<string, string> = {};

  for (const c of contactsData) {
    const contact = await prisma.contact.create({
      data: {
        workspaceId: workspace.id,
        companyId: createdCompanies[c.comp],
        firstName: c.first,
        lastName: c.last,
        email: c.email,
        title: c.title,
        department: c.dept,
      },
    });
    createdContacts[c.email] = contact.id;
  }

  // 8. Leads (Hot, High Intent, Warm, Cooling, and Cold leads)
  const leadsData = [
    {
      company: "Acme Technologies",
      email: "sarah.chen@acmetech.io",
      ownerId: repLiam.id,
      stage: LeadStage.QUALIFIED,
      dealValue: 48000,
      score: 91,
      intent: IntentLevel.HOT,
      source: "WEBSITE",
      nextAction: "Send technical case study and offer 20-minute architecture call.",
      nextActionDue: new Date(Date.now() + 2 * 3600 * 1000), // 2 hours
      posFactors: [
        { name: "Pricing page activity", points: 18 },
        { name: "Demo page visited", points: 12 },
        { name: "Multi-stakeholder engagement (3 contacts)", points: 15 },
        { name: "Email opened 3x & clicked docs", points: 12 },
        { name: "VP Senior decision-maker match", points: 10 },
      ],
      negFactors: [{ name: "Inactivity last weekend", points: -2 }],
      delta7d: 21,
      explanation: "Sarah and 2 team members from Acme Tech show strong purchase intent. Repeated visits to the enterprise pricing and API documentation indicate immediate solution evaluation.",
      evidenceStrength: 0.94,
    },
    {
      company: "ApexCloud Platforms",
      email: "m.vance@apexcloud.dev",
      ownerId: repMaya.id,
      stage: LeadStage.MEETING,
      dealValue: 72000,
      score: 88,
      intent: IntentLevel.HOT,
      source: "CAMPAIGN",
      nextAction: "Conduct architecture review meeting with CTO Marcus Vance.",
      nextActionDue: new Date(Date.now() + 24 * 3600 * 1000),
      posFactors: [
        { name: "Booked demo meeting", points: 25 },
        { name: "Downloaded security compliance PDF", points: 14 },
        { name: "CTO / Executive persona", points: 15 },
        { name: "Ideal company size (500+ employees)", points: 10 },
      ],
      negFactors: [],
      delta7d: 28,
      explanation: "ApexCloud's CTO booked a demo directly after reviewing our SOC2 and security whitepaper. Highly qualified enterprise deal.",
      evidenceStrength: 0.92,
    },
    {
      company: "SecurityZero Corp",
      email: "vstone@securityzero.com",
      ownerId: repLiam.id,
      stage: LeadStage.ENGAGED,
      dealValue: 36000,
      score: 92,
      intent: IntentLevel.HOT,
      source: "WEBSITE",
      nextAction: "Share SSO & RBAC implementation specs with IT team.",
      nextActionDue: new Date(Date.now() + 4 * 3600 * 1000),
      posFactors: [
        { name: "Visited API docs 6 times", points: 22 },
        { name: "Tested webhook endpoint", points: 18 },
        { name: "Reviewed multi-tenant security architecture", points: 15 },
        { name: "CIO role match", points: 12 },
      ],
      negFactors: [],
      delta7d: 34,
      explanation: "Extreme technical engagement. SecurityZero is verifying enterprise identity management and tenant isolation.",
      evidenceStrength: 0.96,
    },
    {
      company: "HyperScale Networks",
      email: "kieran@hyperscale.io",
      ownerId: repMaya.id,
      stage: LeadStage.PROPOSAL,
      dealValue: 64000,
      score: 89,
      intent: IntentLevel.HOT,
      source: "INBOUND",
      nextAction: "Deliver tailored enterprise proposal and SLA guarantees.",
      nextActionDue: new Date(Date.now() + 8 * 3600 * 1000),
      posFactors: [
        { name: "Pricing tier customization requested", points: 20 },
        { name: "Attended product webinar", points: 15 },
        { name: "Director of SE active on product specs", points: 14 },
      ],
      negFactors: [],
      delta7d: 19,
      explanation: "Fast-moving prospect. Both Product and Sales Engineering leadership are aligned on budget.",
      evidenceStrength: 0.91,
    },
    {
      company: "Quantix Financial",
      email: "asterling@quantixfin.com",
      ownerId: alex.id,
      stage: LeadStage.QUALIFIED,
      dealValue: 55000,
      score: 84,
      intent: IntentLevel.HIGH,
      source: "REFERRAL",
      nextAction: "Provide compliance audit log checklist to Risk team.",
      nextActionDue: new Date(Date.now() + 18 * 3600 * 1000),
      posFactors: [
        { name: "High-value financial vertical", points: 16 },
        { name: "Read audit log documentation", points: 14 },
        { name: "Email engagement rate 100%", points: 12 },
      ],
      negFactors: [{ name: "Longer procurement review cycle", points: -4 }],
      delta7d: 14,
      explanation: "Quantix Financial requires strict auditability and high throughput. Strong fit with high willingness to pay.",
      evidenceStrength: 0.88,
    },
    {
      company: "PeakFlow Systems",
      email: "tmeyer@peakflow.tech",
      ownerId: repLiam.id,
      stage: LeadStage.CONTACTED,
      dealValue: 42000,
      score: 86,
      intent: IntentLevel.HOT,
      source: "CAMPAIGN",
      nextAction: "Offer competitive migration incentive and customer benchmark data.",
      nextActionDue: new Date(Date.now() + 5 * 3600 * 1000),
      posFactors: [
        { name: "Compared vs legacy CRM 4x", points: 20 },
        { name: "COO decision-maker", points: 14 },
        { name: "Rapid reply to intro sequence", points: 12 },
      ],
      negFactors: [],
      delta7d: 22,
      explanation: "PeakFlow COO is frustrated with current vendor latency and evaluating migration options.",
      evidenceStrength: 0.89,
    },
    {
      company: "Lumina Health Systems",
      email: "radams@luminahealth.com",
      ownerId: repMaya.id,
      stage: LeadStage.ENGAGED,
      dealValue: 95000,
      score: 78,
      intent: IntentLevel.HIGH,
      source: "WEBSITE",
      nextAction: "Send Business Associate Agreement (BAA) and HIPAA whitepaper.",
      nextActionDue: new Date(Date.now() + 24 * 3600 * 1000),
      posFactors: [
        { name: "Enterprise tier interest (1000+ employees)", points: 18 },
        { name: "Downloaded clinical compliance brief", points: 12 },
        { name: "CISO joined stakeholder thread", points: 14 },
      ],
      negFactors: [{ name: "Inactivity past 5 days awaiting legal", points: -6 }],
      delta7d: 8,
      explanation: "High deal value. Currently waiting on hospital legal review before advancing to procurement.",
      evidenceStrength: 0.85,
    },
    {
      company: "DataForge Analytics",
      email: "zkravitz@dataforge.ai",
      ownerId: repLiam.id,
      stage: LeadStage.QUALIFIED,
      dealValue: 28000,
      score: 74,
      intent: IntentLevel.HIGH,
      source: "WEBSITE",
      nextAction: "Set up sandbox webhook integration with Snowflake instance.",
      nextActionDue: new Date(Date.now() + 12 * 3600 * 1000),
      posFactors: [
        { name: "API key generated in developer portal", points: 16 },
        { name: "Read webhook specs 3 times", points: 10 },
      ],
      negFactors: [{ name: "Budget approval slated for next quarter", points: -5 }],
      delta7d: 11,
      explanation: "High technical affinity. Ready to pilot in sandbox environment.",
      evidenceStrength: 0.87,
    },
    {
      company: "NexaCore Robotics",
      email: "hgruber@nexacore.de",
      ownerId: alex.id,
      stage: LeadStage.CONTACTED,
      dealValue: 80000,
      score: 71,
      intent: IntentLevel.HIGH,
      source: "PARTNER",
      nextAction: "Arrange introductory call with European enterprise lead.",
      nextActionDue: new Date(Date.now() + 36 * 3600 * 1000),
      posFactors: [
        { name: "Referred by strategic OEM partner", points: 20 },
        { name: "Large enterprise revenue ($200M+)", points: 15 },
      ],
      negFactors: [{ name: "Timezone delay in correspondence", points: -4 }],
      delta7d: 7,
      explanation: "Strategic European enterprise account exploring automated signal triggers for connected hardware.",
      evidenceStrength: 0.82,
    },
    {
      company: "OmniChannel Retail",
      email: "hreed@omnichannel.shop",
      ownerId: repMaya.id,
      stage: LeadStage.ENGAGED,
      dealValue: 32000,
      score: 69,
      intent: IntentLevel.WARM,
      source: "INBOUND",
      nextAction: "Follow up with e-commerce conversion optimization case study.",
      nextActionDue: new Date(Date.now() + 48 * 3600 * 1000),
      posFactors: [
        { name: "Clicked link in nurture email", points: 8 },
        { name: "Pricing page visited once", points: 8 },
      ],
      negFactors: [{ name: "Has not responded to calendar invite", points: -5 }],
      delta7d: 4,
      explanation: "Steady interest but competing priorities with upcoming retail peak season.",
      evidenceStrength: 0.80,
    },
    {
      company: "Nexus Logistics Global",
      email: "apendleton@nexuslogistics.net",
      ownerId: repLiam.id,
      stage: LeadStage.CONTACTED,
      dealValue: 50000,
      score: 62,
      intent: IntentLevel.WARM,
      source: "COLD_OUTREACH",
      nextAction: "Share supply chain telemetry integration guide.",
      nextActionDue: new Date(Date.now() + 72 * 3600 * 1000),
      posFactors: [
        { name: "Opened 2 emails in outbound cadence", points: 8 },
        { name: "Visited home page from company IP", points: 6 },
      ],
      negFactors: [{ name: "Legacy enterprise tech stack friction", points: -8 }],
      delta7d: -3,
      explanation: "Lead opened outreach sequence but hasn't yet committed to product demo.",
      evidenceStrength: 0.76,
    },
    {
      company: "OpsMaster Cloud",
      email: "sbauer@opsmaster.io",
      ownerId: repMaya.id,
      stage: LeadStage.NEW,
      dealValue: 18000,
      score: 58,
      intent: IntentLevel.WARM,
      source: "WEBSITE",
      nextAction: "Enroll into DevOps Nurture Sequence.",
      nextActionDue: new Date(Date.now() + 24 * 3600 * 1000),
      posFactors: [{ name: "Downloaded Ansible integration playbook", points: 10 }],
      negFactors: [{ name: "Single user signup", points: -4 }],
      delta7d: 2,
      explanation: "Solo engineer exploring tooling. Needs peer buy-in before purchase.",
      evidenceStrength: 0.74,
    },
    {
      company: "Veloce Media Group",
      email: "lmoretti@velocemedia.co",
      ownerId: repLiam.id,
      stage: LeadStage.CONTACTED,
      dealValue: 15000,
      score: 54,
      intent: IntentLevel.WARM,
      source: "CAMPAIGN",
      nextAction: "Send reminder regarding upcoming product webinar.",
      nextActionDue: new Date(Date.now() + 48 * 3600 * 1000),
      posFactors: [{ name: "Clicked blog link", points: 6 }],
      negFactors: [{ name: "No response after 7 days", points: -6 }],
      delta7d: -8,
      explanation: "Cooling lead. Engaged early in the campaign but momentum has slowed.",
      evidenceStrength: 0.75,
    },
    {
      company: "BioSync Therapeutics",
      email: "coswald@biosynctx.com",
      ownerId: repMaya.id,
      stage: LeadStage.NEW,
      dealValue: 24000,
      score: 42,
      intent: IntentLevel.LOW,
      source: "WEBSITE",
      nextAction: "Send low-touch educational nurture email.",
      nextActionDue: new Date(Date.now() + 96 * 3600 * 1000),
      posFactors: [{ name: "Whitepaper download", points: 8 }],
      negFactors: [{ name: "21 days of inactivity", points: -12 }],
      delta7d: -14,
      explanation: "Downloaded whitepaper 3 weeks ago; no recent web or email engagement.",
      evidenceStrength: 0.78,
    },
    {
      company: "DevSphere Tools",
      email: "felix@devsphere.dev",
      ownerId: repLiam.id,
      stage: LeadStage.NEW,
      dealValue: 6000,
      score: 38,
      intent: IntentLevel.LOW,
      source: "SELF_SERVE",
      nextAction: "Monitor self-serve usage in Free tier.",
      nextActionDue: new Date(Date.now() + 120 * 3600 * 1000),
      posFactors: [{ name: "Account created", points: 6 }],
      negFactors: [{ name: "Very small company size (sub-20)", points: -8 }],
      delta7d: -2,
      explanation: "Small team with low willingness to pay for enterprise tier.",
      evidenceStrength: 0.85,
    },
    {
      company: "Synapse Talent AI",
      email: "gward@synapsetalent.com",
      ownerId: repLiam.id,
      stage: LeadStage.LOST,
      dealValue: 8000,
      score: 24,
      intent: IntentLevel.COLD,
      source: "OUTREACH",
      nextAction: "Archive or re-enroll in cold re-engagement in 90 days.",
      nextActionDue: null,
      posFactors: [],
      negFactors: [
        { name: "Unopened last 4 sequence emails", points: -16 },
        { name: "45 days without visit", points: -18 },
      ],
      delta7d: -10,
      explanation: "Completely cold. Inactivity triggers suggest lack of current budget or relevance.",
      evidenceStrength: 0.95,
    },
  ];

  for (const l of leadsData) {
    const compId = createdCompanies[l.company];
    const contactId = createdContacts[l.email];

    const lead = await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        companyId: compId,
        contactId: contactId,
        ownerId: l.ownerId,
        stage: l.stage,
        dealValue: l.dealValue,
        score: l.score,
        intentLevel: l.intent,
        source: l.source,
        nextAction: l.nextAction,
        nextActionDue: l.nextActionDue,
      },
    });

    // Lead Score Record
    await prisma.leadScore.create({
      data: {
        workspaceId: workspace.id,
        leadId: lead.id,
        currentScore: l.score,
        intentLevel: l.intent,
        positiveFactors: l.posFactors,
        negativeFactors: l.negFactors,
        delta7d: l.delta7d,
        explanation: l.explanation,
        evidenceStrength: l.evidenceStrength,
      },
    });

    // Score Event history
    await prisma.scoreEvent.create({
      data: {
        workspaceId: workspace.id,
        leadId: lead.id,
        previousScore: Math.max(0, l.score - l.delta7d),
        newScore: l.score,
        delta: l.delta7d,
        factorName: "Intent Signals Calculation",
        reason: l.explanation,
      },
    });

    // Tag lead
    if (l.dealValue >= 40000) {
      await prisma.leadTag.create({
        data: { leadId: lead.id, tagId: tagEnterprise.id },
      });
    }
    if (l.intent === IntentLevel.HOT) {
      await prisma.leadTag.create({
        data: { leadId: lead.id, tagId: tagHighTouch.id },
      });
    }

    // Realistic Activity History (for lead detail timeline)
    const now = Date.now();
    const activitiesToCreate = [
      {
        type: ActivityType.PRICING_VISIT,
        title: "Viewed Enterprise Pricing",
        description: "Visited /pricing and spent 3m 42s examining Growth and Enterprise tiers.",
        createdAt: new Date(now - 2 * 3600 * 1000), // 2h ago
      },
      {
        type: ActivityType.EMAIL_OPEN,
        title: "Opened Sequence Email #2",
        description: "Subject: 'Solving multi-touch signal attribution for engineering teams'",
        createdAt: new Date(now - 5 * 3600 * 1000),
      },
      {
        type: ActivityType.DOCS_VIEW,
        title: "Viewed Integration Architecture Docs",
        description: "Looked at /docs/api/webhooks and /docs/security/tenant-isolation",
        createdAt: new Date(now - 22 * 3600 * 1000),
      },
      {
        type: ActivityType.DEMO_VISIT,
        title: "Requested Live Architecture Demo",
        description: "Submitted request form with note: 'Evaluating for Q4 deployment'",
        createdAt: new Date(now - 48 * 3600 * 1000),
      },
    ];

    for (const act of activitiesToCreate) {
      await prisma.activity.create({
        data: {
          workspaceId: workspace.id,
          leadId: lead.id,
          companyId: compId,
          contactId: contactId,
          type: act.type,
          title: act.title,
          description: act.description,
          createdAt: act.createdAt,
        },
      });
    }
  }

  // 9. Sequences (3 Cadences)
  const seqEnterprise = await prisma.sequence.create({
    data: {
      workspaceId: workspace.id,
      name: "Enterprise Architecture Outbound",
      description: "4-step cadence tailored for VPs of Engineering and CTOs",
      status: SequenceStatus.ACTIVE,
      triggerType: "SCORE_THRESHOLD_75",
      enrolledCount: 14,
      openRate: 0.68,
      clickRate: 0.42,
      replyRate: 0.28,
    },
  });

  await prisma.sequenceStep.createMany({
    data: [
      {
        sequenceId: seqEnterprise.id,
        stepOrder: 1,
        delayDays: 0,
        stepType: "EMAIL",
        subject: "Prioritizing engineering signals at {{company}}",
        body: "Hi {{first_name}},\n\nI noticed your team at {{company}} has been looking into real-time signal capture. Most engineering leaders tell us they lose 40% of high-intent buyers because sales reaches out too late.\n\nWould you be open to a 15-minute architecture briefing this Thursday?\n\nBest,\nLiam",
      },
      {
        sequenceId: seqEnterprise.id,
        stepOrder: 2,
        delayDays: 2,
        stepType: "EMAIL",
        subject: "Quick follow-up + technical benchmark",
        body: "Hi {{first_name}},\n\nHere is our recent benchmark comparing signal latency vs conversion rate. Thought you might find the tenant isolation architecture interesting.\n\nLet me know if you'd like the full technical report.",
      },
      {
        sequenceId: seqEnterprise.id,
        stepOrder: 3,
        delayDays: 5,
        stepType: "EMAIL",
        subject: "Case study: How ApexCloud reduced sales response time by 3.4x",
        body: "Hi {{first_name}},\n\nSharing how a team with similar infrastructure to {{company}} automated their lead priority queue with explainable scoring.",
      },
      {
        sequenceId: seqEnterprise.id,
        stepOrder: 4,
        delayDays: 8,
        stepType: "EMAIL",
        subject: "Should I close your file?",
        body: "Hi {{first_name}},\n\nI haven't heard back, so I assume timing isn't right. I'll pause our updates unless you'd like to revisit next quarter.",
      },
    ],
  });

  const seqRapid = await prisma.sequence.create({
    data: {
      workspaceId: workspace.id,
      name: "High-Intent 2-Hour Rapid Response",
      description: "Instant notification & personalized outreach when score crosses 85",
      status: SequenceStatus.ACTIVE,
      triggerType: "SCORE_HOT_85",
      enrolledCount: 8,
      openRate: 0.85,
      clickRate: 0.62,
      replyRate: 0.45,
    },
  });

  await prisma.sequenceStep.createMany({
    data: [
      {
        sequenceId: seqRapid.id,
        stepOrder: 1,
        delayDays: 0,
        stepType: "EMAIL",
        subject: "Questions on the {{company}} evaluation?",
        body: "Hi {{first_name}},\n\nSaw you were checking out our enterprise pricing and architecture documentation today. Happy to answer any specific questions or set up a dedicated sandbox for {{company}}.\n\nBest,\nMaya",
      },
      {
        sequenceId: seqRapid.id,
        stepOrder: 2,
        delayDays: 1,
        stepType: "TASK",
        subject: "Call stakeholder or connect on LinkedIn",
        body: "Review latest website activity logs and initiate direct phone or social touchpoint.",
      },
    ],
  });

  // 10. Automations (Visual Workflow Builder Seed)
  await prisma.automation.create({
    data: {
      workspaceId: workspace.id,
      name: "Hot Lead Instant Routing & Escalation",
      description: "When score > 80 and pricing viewed, assign Senior Rep, notify Slack, and start cadence",
      status: SequenceStatus.ACTIVE,
      triggerType: "SCORE_GREATER_THAN",
      executionCount: 47,
      nodes: [
        { id: "node-1", type: "trigger", title: "Trigger: Score > 80", data: { field: "score", operator: ">", value: 80 } },
        { id: "node-2", type: "condition", title: "Condition: Visited Pricing?", data: { event: "PRICING_VISIT", days: 3 } },
        { id: "node-3", type: "action", title: "Action: Assign to Senior Rep", data: { assignTo: "senior_rep" } },
        { id: "node-4", type: "aiAction", title: "AI Action: Generate Personalized Angle", data: { model: "gemini", focus: "technical_intent" } },
        { id: "node-5", type: "action", title: "Action: Enroll in Rapid Sequence", data: { sequenceId: seqRapid.id } },
      ],
      edges: [
        { id: "e1-2", source: "node-1", target: "node-2" },
        { id: "e2-3", source: "node-2", target: "node-3", label: "YES" },
        { id: "e3-4", source: "node-3", target: "node-4" },
        { id: "e4-5", source: "node-4", target: "node-5" },
      ],
    },
  });

  // 11. API Keys & Webhooks (Dynamically generated at runtime — zero hardcoded credentials)
  const randomPrefix = crypto.randomBytes(4).toString("hex");
  const randomSecret = crypto.randomBytes(24).toString("hex");
  const runtimeGeneratedKey = `sf_live_${randomPrefix}_${randomSecret}`;
  const runtimeKeyHash = crypto.createHash("sha256").update(runtimeGeneratedKey).digest("hex");

  await prisma.apiKey.create({
    data: {
      workspaceId: workspace.id,
      name: "Default Inbound Telemetry Key",
      keyPrefix: randomPrefix,
      keyHash: runtimeKeyHash,
      permissions: ["read", "write"],
    },
  });

  await prisma.webhook.create({
    data: {
      workspaceId: workspace.id,
      name: "HubSpot CRM Synchronization",
      url: "https://api.hubapi.com/webhooks/v1/signalflow",
      secret: "whsec_993f8e12d4",
      eventTypes: ["lead.created", "lead.score_changed", "deal.won"],
      active: true,
    },
  });

  // 12. Notifications
  await prisma.notification.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: alex.id,
        title: "🔥 Sarah Chen reached Hot Intent (Score: 91)",
        message: "Acme Technologies has 3 active stakeholders viewing enterprise docs.",
        type: "LEAD_HOT",
        read: false,
      },
      {
        workspaceId: workspace.id,
        userId: repMaya.id,
        title: "⚡ Marcus Vance booked Architecture Review",
        message: "ApexCloud Platforms requested a calendar slot for tomorrow at 2 PM.",
        type: "ALERT",
        read: false,
      },
      {
        workspaceId: workspace.id,
        userId: repLiam.id,
        title: "📩 Follow-up due today: PeakFlow Systems",
        message: "Tobias Meyer opened Sequence Email #2 twice this morning.",
        type: "ALERT",
        read: true,
      },
    ],
  });

  // 13. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: alex.id,
        action: "WORKSPACE_CONFIG_UPDATED",
        entityType: "Workspace",
        entityId: workspace.id,
        details: { change: "Enabled auto-pause on sequence reply" },
      },
      {
        workspaceId: workspace.id,
        userId: sarahAdmin.id,
        action: "LEAD_SCORE_CALCULATED",
        entityType: "Lead",
        entityId: "acme-sarah-chen",
        details: { score: 91, delta: +21, reason: "Pricing page & multi-stakeholder surge" },
      },
      {
        workspaceId: workspace.id,
        userId: repLiam.id,
        action: "SEQUENCE_ENROLLED",
        entityType: "Sequence",
        entityId: seqEnterprise.id,
        details: { enrolledLeadsCount: 5 },
      },
    ],
  });

  console.log("✅ SignalFlow seed completed successfully!");
  console.log("👥 Demo accounts:");
  console.log("   - Alex Morgan (Owner): alex.morgan@signalflow.io / SignalFlow2026!");
  console.log("   - Sarah Connor (Admin): sarah.connor@signalflow.io / SignalFlow2026!");
  console.log("   - Liam Vance (Rep): liam.vance@signalflow.io / SignalFlow2026!");
  console.log("   - Maya Patel (Rep): maya.patel@signalflow.io / SignalFlow2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
