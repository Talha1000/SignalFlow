import { prisma } from "../src/lib/prisma";

const BASE_URL = "http://localhost:3000";

interface TestResult {
  category: string;
  name: string;
  status: "PASS" | "FAIL" | "WARN";
  details?: string;
}

const results: TestResult[] = [];

function logPass(category: string, name: string, details?: string) {
  results.push({ category, name, status: "PASS", details });
  console.log(`✅ [PASS] [${category}] ${name}${details ? ` - ${details}` : ""}`);
}

function logFail(category: string, name: string, error: any) {
  const details = error?.message || String(error);
  results.push({ category, name, status: "FAIL", details });
  console.error(`❌ [FAIL] [${category}] ${name}: ${details}`);
}

function logWarn(category: string, name: string, warning: string) {
  results.push({ category, name, status: "WARN", details: warning });
  console.warn(`⚠️ [WARN] [${category}] ${name}: ${warning}`);
}

async function run() {
  console.log("==================================================================");
  console.log("🔍 FULL LIVE WEBSITE AUDIT & END-TO-END VERIFICATION ON LOCALHOST");
  console.log(`Base URL: ${BASE_URL}`);
  console.log("==================================================================\n");

  // ---------------------------------------------------------
  // 1. PUBLIC MARKETING & INFORMATIONAL PAGES
  // ---------------------------------------------------------
  const publicPages = [
    { path: "/", titleCheck: "SignalFlow" },
    { path: "/features", titleCheck: "Features" },
    { path: "/pricing", titleCheck: "Pricing" },
    { path: "/about", titleCheck: "About" },
    { path: "/security", titleCheck: "Security" },
    { path: "/privacy", titleCheck: "Privacy" },
    { path: "/terms", titleCheck: "Terms" },
    { path: "/contact", titleCheck: "Contact" },
    { path: "/login", titleCheck: "Sign in" },
    { path: "/signup", titleCheck: "SignalFlow" },
  ];

  for (const page of publicPages) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      if (res.status === 200) {
        const text = await res.text();
        const hasText = text.toLowerCase().includes(page.titleCheck.toLowerCase());
        if (hasText) {
          logPass("Public Pages", `GET ${page.path}`, `HTTP 200, contains '${page.titleCheck}'`);
        } else {
          logWarn("Public Pages", `GET ${page.path}`, `HTTP 200 but keyword '${page.titleCheck}' not detected`);
        }
      } else {
        logFail("Public Pages", `GET ${page.path}`, `Expected HTTP 200, got ${res.status}`);
      }
    } catch (err) {
      logFail("Public Pages", `GET ${page.path}`, err);
    }
  }

  // 1.1 Test Contact Inquiries API
  try {
    const contactRes = await fetch(`${BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: "Test",
        lastName: "Inquirer",
        email: "test.inquirer@company.com",
        company: "Test Automated Corp",
        teamSize: "11-50",
        message: "Automated end-to-end verification inquiry.",
      }),
    });
    const contactData = await contactRes.json();
    if (contactRes.status === 200 && contactData.data?.received) {
      logPass("Public Pages", "POST /api/contact", `Submitted inquiry for ${contactData.data.company}`);
    } else {
      logFail("Public Pages", "POST /api/contact", JSON.stringify(contactData));
    }
  } catch (err) {
    logFail("Public Pages", "POST /api/contact", err);
  }

  // ---------------------------------------------------------
  // 2. AUTHENTICATION FLOWS (LOGIN, DEMO, ME, LOGOUT)
  // ---------------------------------------------------------
  let sessionCookie = "";

  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alex.morgan@signalflow.io",
        password: "SignalFlow2026!",
      }),
    });

    const loginData = await loginRes.json();
    const rawSetCookie = loginRes.headers.get("set-cookie") || "";

    if (loginRes.status === 200 && rawSetCookie.includes("signalflow_session")) {
      sessionCookie = rawSetCookie.split(";")[0];
      const userEmail = loginData.user?.email || loginData.data?.user?.email;
      logPass("Auth", "POST /api/auth/login", `Authenticated as ${userEmail}`);
    } else {
      logFail("Auth", "POST /api/auth/login", `Failed: status ${loginRes.status}, body: ${JSON.stringify(loginData)}`);
    }
  } catch (err) {
    logFail("Auth", "POST /api/auth/login", err);
  }

  const authHeaders = {
    Cookie: sessionCookie,
    "Content-Type": "application/json",
  };

  // Verify /api/auth/me
  try {
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, { headers: authHeaders });
    const meData = await meRes.json();
    if (meRes.status === 200 && meData.data?.user?.email === "alex.morgan@signalflow.io") {
      logPass("Auth", "GET /api/auth/me", `Workspace: ${meData.data?.workspace?.name} (${meData.data?.workspace?.id})`);
    } else {
      logFail("Auth", "GET /api/auth/me", `Unexpected response: ${JSON.stringify(meData)}`);
    }
  } catch (err) {
    logFail("Auth", "GET /api/auth/me", err);
  }

  // ---------------------------------------------------------
  // 3. AUTHENTICATED APP PAGES (ALL POST-LOGIN ROUTES)
  // ---------------------------------------------------------
  const appRoutes = [
    "/app/dashboard",
    "/app/inbox",
    "/app/leads",
    "/app/companies",
    "/app/contacts",
    "/app/pipeline",
    "/app/sequences",
    "/app/automations",
    "/app/campaigns",
    "/app/analytics",
    "/app/ai-insights",
    "/app/integrations",
    "/app/team",
    "/app/settings",
    "/app/onboarding",
  ];

  for (const route of appRoutes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`, { headers: { Cookie: sessionCookie } });
      if (res.status === 200) {
        logPass("App Pages", `GET ${route}`, "HTTP 200 Rendered");
      } else {
        logFail("App Pages", `GET ${route}`, `Returned HTTP ${res.status}`);
      }
    } catch (err) {
      logFail("App Pages", `GET ${route}`, err);
    }
  }

  // ---------------------------------------------------------
  // 4. WORKSPACE & USAGE API
  // ---------------------------------------------------------
  try {
    const wsRes = await fetch(`${BASE_URL}/api/v1/workspace`, { headers: authHeaders });
    const wsData = await wsRes.json();
    const wsId = wsData.data?.id || wsData.data?.workspace?.id;
    if (wsRes.status === 200 && wsId) {
      logPass("Workspace", "GET /api/v1/workspace", `Plan: ${wsData.data.plan || wsData.data.workspace?.plan}`);
    } else {
      logFail("Workspace", "GET /api/v1/workspace", JSON.stringify(wsData));
    }
  } catch (err) {
    logFail("Workspace", "GET /api/v1/workspace", err);
  }

  try {
    const usageRes = await fetch(`${BASE_URL}/api/v1/workspace/usage`, { headers: authHeaders });
    const usageData = await usageRes.json();
    const leadsCurrent = usageData.data?.usage?.leads?.current ?? usageData.data?.usage?.leadsCount;
    if (usageRes.status === 200 && usageData.data?.usage) {
      logPass("Workspace", "GET /api/v1/workspace/usage", `Leads count: ${leadsCurrent}`);
    } else {
      logFail("Workspace", "GET /api/v1/workspace/usage", JSON.stringify(usageData));
    }
  } catch (err) {
    logFail("Workspace", "GET /api/v1/workspace/usage", err);
  }

  // ---------------------------------------------------------
  // 5. LEADS API & MUTATION TESTS
  // ---------------------------------------------------------
  let createdLeadId = "";
  try {
    // 5.1 GET leads
    const leadsRes = await fetch(`${BASE_URL}/api/v1/leads`, { headers: authHeaders });
    const leadsData = await leadsRes.json();
    const leadsList = Array.isArray(leadsData.data) ? leadsData.data : leadsData.data?.leads;
    if (leadsRes.status === 200 && Array.isArray(leadsList)) {
      logPass("Leads API", "GET /api/v1/leads", `Found ${leadsList.length} leads in database`);
    } else {
      logFail("Leads API", "GET /api/v1/leads", JSON.stringify(leadsData));
    }

    // 5.2 POST lead (create)
    const createLeadRes = await fetch(`${BASE_URL}/api/v1/leads`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        companyName: "HyperTest Systems Inc",
        domain: "hypertest.io",
        contactName: "Jordan Belfort",
        email: "jordan@hypertest.io",
        title: "VP Revenue Operations",
        score: 75,
        dealValue: 35000,
        stage: "NEW",
      }),
    });
    const createLeadData = await createLeadRes.json();
    if (createLeadRes.status === 200 || createLeadRes.status === 201) {
      createdLeadId = createLeadData.data?.lead?.id || createLeadData.data?.id;
      logPass("Leads API", "POST /api/v1/leads", `Created lead: ${createdLeadId}`);
    } else {
      logFail("Leads API", "POST /api/v1/leads", JSON.stringify(createLeadData));
    }

    // 5.3 Verify detail page for newly created lead
    if (createdLeadId) {
      const detailRes = await fetch(`${BASE_URL}/app/leads/${createdLeadId}`, { headers: { Cookie: sessionCookie } });
      if (detailRes.status === 200) {
        logPass("Leads API", `GET /app/leads/${createdLeadId}`, "Detail page rendered HTTP 200");
      } else {
        logFail("Leads API", `GET /app/leads/${createdLeadId}`, `HTTP ${detailRes.status}`);
      }

      // 5.4 PATCH lead (update stage)
      const patchRes = await fetch(`${BASE_URL}/api/v1/leads/${createdLeadId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          stage: "ENGAGED",
          dealValue: 42000,
        }),
      });
      const patchData = await patchRes.json();
      const updatedStage = patchData.data?.stage || patchData.data?.lead?.stage;
      if (patchRes.status === 200 && updatedStage === "ENGAGED") {
        logPass("Leads API", `PATCH /api/v1/leads/${createdLeadId}`, "Updated stage to ENGAGED, dealValue to $42,000");
      } else {
        logFail("Leads API", `PATCH /api/v1/leads/${createdLeadId}`, JSON.stringify(patchData));
      }
    }
  } catch (err) {
    logFail("Leads API", "Leads operations", err);
  }

  // ---------------------------------------------------------
  // 6. INBOX API & PERSISTENCE
  // ---------------------------------------------------------
  try {
    // 6.1 GET threads
    const inboxThreadsRes = await fetch(`${BASE_URL}/api/v1/inbox/threads`, { headers: authHeaders });
    const inboxThreadsData = await inboxThreadsRes.json();
    if (inboxThreadsRes.status === 200 && Array.isArray(inboxThreadsData.data?.threads)) {
      logPass("Inbox API", "GET /api/v1/inbox/threads", `Found ${inboxThreadsData.data.threads.length} live database threads`);
      
      const firstThread = inboxThreadsData.data.threads[0];
      if (firstThread) {
        // 6.2 Simulate inbound reply
        const simRes = await fetch(`${BASE_URL}/api/v1/inbox/simulate`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            leadId: firstThread.leadId,
            subject: "Re: Quick question",
            body: "We have budget allocated for Q4. Can you send over an enterprise contract draft?",
            sentiment: "MEETING_REQUESTED",
          }),
        });
        const simData = await simRes.json();
        if (simRes.status === 200 && simData.data?.activityId) {
          logPass("Inbox API", "POST /api/v1/inbox/simulate", `Inbound reply simulated: score boosted to ${simData.data.newScore} (+${simData.data.scoreDelta})`);
        } else {
          logFail("Inbox API", "POST /api/v1/inbox/simulate", JSON.stringify(simData));
        }

        // 6.3 Send outbound reply (sandbox persistence)
        const sendRes = await fetch(`${BASE_URL}/api/v1/email/send`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            leadId: firstThread.leadId,
            to: firstThread.email,
            subject: "Re: Quick question",
            body: "Great to hear! I've attached our enterprise architecture overview and contract terms.",
            allowLocalRecord: true,
          }),
        });
        const sendData = await sendRes.json();
        if (sendRes.status === 200 && sendData.data?.activityId) {
          logPass("Inbox API", "POST /api/v1/email/send", `Outbound reply persisted in PostgreSQL: status=${sendData.data.status}`);
        } else {
          logFail("Inbox API", "POST /api/v1/email/send", JSON.stringify(sendData));
        }
      }
    } else {
      logFail("Inbox API", "GET /api/v1/inbox/threads", JSON.stringify(inboxThreadsData));
    }
  } catch (err) {
    logFail("Inbox API", "Inbox operations", err);
  }

  // ---------------------------------------------------------
  // 7. SEQUENCES & CADENCES API
  // ---------------------------------------------------------
  try {
    const seqRes = await fetch(`${BASE_URL}/api/v1/sequences`, { headers: authHeaders });
    const seqData = await seqRes.json();
    const seqList = Array.isArray(seqData.data) ? seqData.data : seqData.data?.sequences;
    if (seqRes.status === 200 && Array.isArray(seqList)) {
      logPass("Sequences API", "GET /api/v1/sequences", `Found ${seqList.length} cadences`);
      
      const firstSeq = seqList[0];
      if (firstSeq && createdLeadId) {
        // Enroll lead into cadence
        const enrollRes = await fetch(`${BASE_URL}/api/v1/sequences/enroll`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            sequenceId: firstSeq.id,
            leadId: createdLeadId,
          }),
        });
        const enrollData = await enrollRes.json();
        const enrollId = enrollData.data?.enrollment?.id || enrollData.data?.enrollmentId;
        if ((enrollRes.status === 200 || enrollRes.status === 201) && enrollId) {
          logPass("Sequences API", "POST /api/v1/sequences/enroll", `Enrolled lead ${createdLeadId} into cadence '${firstSeq.name}'`);
        } else {
          logFail("Sequences API", "POST /api/v1/sequences/enroll", JSON.stringify(enrollData));
        }
      }
    } else {
      logFail("Sequences API", "GET /api/v1/sequences", JSON.stringify(seqData));
    }
  } catch (err) {
    logFail("Sequences API", "Sequences operations", err);
  }

  // ---------------------------------------------------------
  // 8. AUTOMATIONS API
  // ---------------------------------------------------------
  try {
    const autoRes = await fetch(`${BASE_URL}/api/v1/automations`, { headers: authHeaders });
    const autoData = await autoRes.json();
    const automationsList = Array.isArray(autoData.data) ? autoData.data : autoData.data?.automations;
    if (autoRes.status === 200 && Array.isArray(automationsList)) {
      logPass("Automations API", "GET /api/v1/automations", `Found ${automationsList.length} automations`);
    } else {
      logFail("Automations API", "GET /api/v1/automations", JSON.stringify(autoData));
    }
  } catch (err) {
    logFail("Automations API", "GET /api/v1/automations", err);
  }

  // ---------------------------------------------------------
  // 9. AI COPILOT & AI DRAFTING API
  // ---------------------------------------------------------
  try {
    const copilotRes = await fetch(`${BASE_URL}/api/v1/copilot`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ query: "Which leads have high intent today?" }),
    });
    const copilotData = await copilotRes.json();
    const copilotReply = copilotData.data?.answer || copilotData.data?.reply;
    if (copilotRes.status === 200 && copilotReply) {
      logPass("AI Copilot", "POST /api/v1/copilot", `Responded: "${copilotReply.substring(0, 60)}..."`);
    } else {
      logFail("AI Copilot", "POST /api/v1/copilot", JSON.stringify(copilotData));
    }
  } catch (err) {
    logFail("AI Copilot", "POST /api/v1/copilot", err);
  }

  // ---------------------------------------------------------
  // 10. SEARCH & COMMAND PALETTE API
  // ---------------------------------------------------------
  try {
    const searchRes = await fetch(`${BASE_URL}/api/v1/search?q=Acme`, { headers: authHeaders });
    const searchData = await searchRes.json();
    if (searchRes.status === 200 && Array.isArray(searchData.data?.results)) {
      logPass("Search API", "GET /api/v1/search?q=Acme", `Found ${searchData.data.results.length} matching entities`);
    } else {
      logFail("Search API", "GET /api/v1/search?q=Acme", JSON.stringify(searchData));
    }
  } catch (err) {
    logFail("Search API", "GET /api/v1/search", err);
  }

  // ---------------------------------------------------------
  // 11. API KEYS & SECURITY SETTINGS
  // ---------------------------------------------------------
  let createdKeyId = "";
  try {
    // 11.1 Create API key
    const createKeyRes = await fetch(`${BASE_URL}/api/v1/keys`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Automated Test API Key",
        permissions: ["read", "write"],
      }),
    });
    const createKeyData = await createKeyRes.json();
    if ((createKeyRes.status === 200 || createKeyRes.status === 201) && createKeyData.data?.rawKey) {
      createdKeyId = createKeyData.data?.id || createKeyData.data?.keyRecord?.id;
      logPass("API Keys", "POST /api/v1/keys", `Generated key prefix ${createKeyData.data.keyPrefix}`);
    } else {
      logFail("API Keys", "POST /api/v1/keys", JSON.stringify(createKeyData));
    }

    // 11.2 List API keys
    const listKeysRes = await fetch(`${BASE_URL}/api/v1/keys`, { headers: authHeaders });
    const listKeysData = await listKeysRes.json();
    const keysList = Array.isArray(listKeysData.data) ? listKeysData.data : listKeysData.data?.keys;
    if (listKeysRes.status === 200 && Array.isArray(keysList)) {
      logPass("API Keys", "GET /api/v1/keys", `Found ${keysList.length} keys`);
    } else {
      logFail("API Keys", "GET /api/v1/keys", JSON.stringify(listKeysData));
    }

    // 11.3 Revoke API key
    if (createdKeyId) {
      const deleteKeyRes = await fetch(`${BASE_URL}/api/v1/keys/${createdKeyId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (deleteKeyRes.status === 200) {
        logPass("API Keys", `DELETE /api/v1/keys/${createdKeyId}`, "Key safely revoked");
      } else {
        logFail("API Keys", `DELETE /api/v1/keys/${createdKeyId}`, `Status: ${deleteKeyRes.status}`);
      }
    }
  } catch (err) {
    logFail("API Keys", "API key management", err);
  }

  // ---------------------------------------------------------
  // 12. WEBHOOKS API & SSRF SAFETY
  // ---------------------------------------------------------
  let createdWebhookId = "";
  try {
    // 12.1 Attempt blocked SSRF private webhook
    const ssrfBlockRes = await fetch(`${BASE_URL}/api/v1/webhooks`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Malicious Webhook Attempt",
        url: "https://169.254.169.254/secret",
        eventTypes: ["lead.created"],
      }),
    });
    if (ssrfBlockRes.status === 400) {
      logPass("Webhooks", "SSRF Defense on POST /api/v1/webhooks", "Blocked cloud metadata IP (HTTP 400)");
    } else {
      logFail("Webhooks", "SSRF Defense on POST /api/v1/webhooks", `Expected 400, got ${ssrfBlockRes.status}`);
    }

    // 12.2 Create valid HTTPS public webhook
    const validWhRes = await fetch(`${BASE_URL}/api/v1/webhooks`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        name: "Production Slack Alerts",
        url: "https://hooks.slack.com/services/T00/B00/X000",
        eventTypes: ["lead.created", "lead.score_changed"],
      }),
    });
    const validWhData = await validWhRes.json();
    const whId = validWhData.data?.id || validWhData.data?.webhook?.id;
    if ((validWhRes.status === 200 || validWhRes.status === 201) && whId) {
      createdWebhookId = whId;
      logPass("Webhooks", "POST /api/v1/webhooks", `Created webhook: ${createdWebhookId}`);
    } else {
      logFail("Webhooks", "POST /api/v1/webhooks", JSON.stringify(validWhData));
    }

    // 12.3 Delete webhook
    if (createdWebhookId) {
      const delWhRes = await fetch(`${BASE_URL}/api/v1/webhooks/${createdWebhookId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (delWhRes.status === 200) {
        logPass("Webhooks", `DELETE /api/v1/webhooks/${createdWebhookId}`, "Webhook safely deleted");
      } else {
        logFail("Webhooks", `DELETE /api/v1/webhooks/${createdWebhookId}`, `Status: ${delWhRes.status}`);
      }
    }
  } catch (err) {
    logFail("Webhooks", "Webhook management", err);
  }

  // ---------------------------------------------------------
  // 13. TEAM MEMBERS & ROLES API
  // ---------------------------------------------------------
  try {
    const teamRes = await fetch(`${BASE_URL}/api/v1/team`, { headers: authHeaders });
    const teamData = await teamRes.json();
    const membersList = Array.isArray(teamData.data) ? teamData.data : teamData.data?.members;
    if (teamRes.status === 200 && Array.isArray(membersList)) {
      logPass("Team API", "GET /api/v1/team", `Found ${membersList.length} workspace members`);
    } else {
      logFail("Team API", "GET /api/v1/team", JSON.stringify(teamData));
    }
  } catch (err) {
    logFail("Team API", "GET /api/v1/team", err);
  }

  // ---------------------------------------------------------
  // 14. NOTIFICATIONS API
  // ---------------------------------------------------------
  try {
    const notifRes = await fetch(`${BASE_URL}/api/v1/notifications`, { headers: authHeaders });
    const notifData = await notifRes.json();
    if (notifRes.status === 200 && Array.isArray(notifData.data?.notifications)) {
      logPass("Notifications API", "GET /api/v1/notifications", `Found ${notifData.data.notifications.length} notifications`);
    } else {
      logFail("Notifications API", "GET /api/v1/notifications", JSON.stringify(notifData));
    }
  } catch (err) {
    logFail("Notifications API", "GET /api/v1/notifications", err);
  }

  // ---------------------------------------------------------
  // 15. CLEANUP CREATED TEST DATA
  // ---------------------------------------------------------
  if (createdLeadId) {
    try {
      await prisma.lead.delete({ where: { id: createdLeadId } });
      logPass("Cleanup", "Delete test lead", `Removed lead ${createdLeadId} from database`);
    } catch {
      // ignore
    }
  }

  // ---------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------
  const passes = results.filter((r) => r.status === "PASS").length;
  const fails = results.filter((r) => r.status === "FAIL").length;
  const warns = results.filter((r) => r.status === "WARN").length;

  console.log("\n==================================================================");
  console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${passes} | FAILED: ${fails} | WARNINGS: ${warns}`);
  console.log("==================================================================");

  if (fails > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
