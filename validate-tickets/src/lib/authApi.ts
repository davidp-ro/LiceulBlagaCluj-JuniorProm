export interface AuthApiResponse {
  isNowAuthenticated: boolean;
  responseText: string;
}

export class AuthAPI {
  private static readonly URL =
    "https://orgmnmtsdkspdewajaeo.functions.supabase.co/auth";
  private static readonly anonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZ21ubXRzZGtzcGRld2FqYWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ5ODY0MjMsImV4cCI6MTk4MDU2MjQyM30.4Q-29QN7-YCTKjRfcSdfMWMuAJlNMSrgcl9LQPZT1k8";

  static async validateAuthCode(authCode: string): Promise<AuthApiResponse> {
    let res;
    try {
      res = await fetch(this.URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.anonKey}`,
        },
        body: JSON.stringify({
          authCode,
        }),
      });
    } catch (e) {
      console.error(e);
      return { isNowAuthenticated: false, responseText: e };
    }

    const json = await res.json();
    return {
      isNowAuthenticated: json.status === "ok",
      responseText: json.data,
    };
  }
}
