export interface ValidateApiResponse {
  isValid: boolean;
  error?: string;
  ticket?: Ticket;
}

interface Ticket {
  code: string;
  entries_remaining: number;
  ticket_type: "student+generic" | "guest+vip";
  expires_at: string;
  created_at: string;
  entries: string[];
}

export class ValidateAPI {
  private static readonly URL =
    "https://orgmnmtsdkspdewajaeo.functions.supabase.co/validate";
  private static readonly anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ21ubXRzZGtzcGRld2FqYWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ5ODY0MjMsImV4cCI6MTk4MDU2MjQyM30.4Q-29QN7-YCTKjRfcSdfMWMuAJlNMSrgcl9LQPZT1k8";

  static async validateTicket(barcode: string): Promise<ValidateApiResponse> {
    let res: Response;
    try {
      res = await fetch(this.URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.anonKey}`,
        },
        body: JSON.stringify({
          barcode,
        }),
      });
    } catch (e) {
      console.error(e);
      return { isValid: false, error: e };
    }

    const json = await res.json();
    if (json.status === "fail") {
      return { isValid: false, error: json.data };
    } else {
      return { isValid: true, ticket: json.data };
    }
  }
}
