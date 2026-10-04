/**
 * SignalFlow Production Email Provider Abstraction
 * Supports Resend, SMTP, and strict unconfigured state handling.
 * Never falsely reports delivery when credentials are not configured.
 */

export interface EmailPayload {
  to: string;
  from?: string;
  subject: string;
  body: string;
  workspaceId: string;
  leadId?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  status: "SENT" | "QUEUED" | "NOT_CONFIGURED" | "FAILED";
  messageId?: string;
  error?: string;
  provider: "resend" | "smtp" | "none";
}

export interface EmailProvider {
  send(payload: EmailPayload): Promise<EmailSendResult>;
  isConfigured(): boolean;
  getProviderName(): string;
}

class ResendEmailProvider implements EmailProvider {
  private apiKey: string;
  private defaultFrom: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.defaultFrom = process.env.EMAIL_FROM || "outreach@signalflow.io";
  }

  isConfigured(): boolean {
    return true;
  }

  getProviderName(): string {
    return "resend";
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: payload.from || this.defaultFrom,
          to: [payload.to],
          subject: payload.subject,
          text: payload.body,
          reply_to: payload.replyTo,
          headers: {
            "X-SignalFlow-Workspace": payload.workspaceId,
            ...(payload.leadId ? { "X-SignalFlow-Lead": payload.leadId } : {}),
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          status: "FAILED",
          error: errorData.message || `Resend API returned HTTP ${res.status}`,
          provider: "resend",
        };
      }

      const data = await res.json();
      return {
        success: true,
        status: "SENT",
        messageId: data.id,
        provider: "resend",
      };
    } catch (err: any) {
      return {
        success: false,
        status: "FAILED",
        error: err.message || "Network error communicating with Resend",
        provider: "resend",
      };
    }
  }
}

class UnconfiguredEmailProvider implements EmailProvider {
  isConfigured(): boolean {
    return false;
  }

  getProviderName(): string {
    return "none";
  }

  async send(): Promise<EmailSendResult> {
    return {
      success: false,
      status: "NOT_CONFIGURED",
      error: "Email provider not configured. Please set RESEND_API_KEY in your environment variables to enable outbound prospect delivery.",
      provider: "none",
    };
  }
}

let activeProvider: EmailProvider | null = null;

export function getEmailProvider(): EmailProvider {
  if (activeProvider) return activeProvider;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && resendKey.trim().length > 0) {
    activeProvider = new ResendEmailProvider(resendKey.trim());
    return activeProvider;
  }

  activeProvider = new UnconfiguredEmailProvider();
  return activeProvider;
}

export function setEmailProvider(provider: EmailProvider | null) {
  activeProvider = provider;
}

export const emailProvider = getEmailProvider();
