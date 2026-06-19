import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<"reverb">;
  }
}

let echo: Echo<"reverb"> | null = null;

export function getEcho(): Echo<"reverb"> {
  if (echo) return echo;

  window.Pusher = Pusher;

  echo = new Echo({
    broadcaster:       "reverb",
    key:               process.env.NEXT_PUBLIC_REVERB_APP_KEY!,
    wsHost:            process.env.NEXT_PUBLIC_REVERB_HOST!,
    wsPort:            Number(process.env.NEXT_PUBLIC_REVERB_PORT!),
    wssPort:           Number(process.env.NEXT_PUBLIC_REVERB_PORT!),
    forceTLS:          process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
    enabledTransports: ["ws", "wss"],
    // ─── FIXED: withCredentials is now explicitly placed here at the root ───
    withCredentials:   true, 
    authEndpoint:      `${process.env.NEXT_PUBLIC_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": getCsrfToken(),
      },
    },
  });

  return echo;
}

export function disconnectEcho() {
  echo?.disconnect();
  echo = null;
}

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";

  return decodeURIComponent(
    document.cookie
      .split("; ")
      .find((r) => r.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] ?? ""
  );
}