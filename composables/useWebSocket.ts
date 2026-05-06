type WSStatus = "connecting" | "connected" | "disconnected";
type NotificationType =
  | "connected"
  | "achievement_earned"
  | "ping"
  | "pong"
  | "error"
  | "unknown";

interface Achievement {
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  icon?: string;
  type?: string;
  points?: number;
  timestamp?: number;
}

interface Notification {
  type: NotificationType;
  data: Achievement;
  timestamp?: number;
}

const globalStatus = ref<WSStatus>("disconnected");
const globalNotifications = ref<Notification[]>([]);
const globalLastAchievement = ref<Achievement | null>(null);
const globalAchievementQueue = ref<Achievement[]>([]);

let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let isConnecting = false;

export const useWebSocket = () => {
  const config = useRuntimeConfig();

  const connect = () => {
    const token = useCookie("access_token").value;

    if (!token) {
      console.log("[WS] ❌ No token, skipping connection");
      return;
    }

    if (globalStatus.value === "connected" || isConnecting) {
      console.log("[WS] Already connected or connecting, skipping");
      return;
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("[WS] WebSocket already open, updating status");
      globalStatus.value = "connected";
      return;
    }

    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log("[WS] Max reconnect attempts reached, stopping");
      return;
    }

    isConnecting = true;
    globalStatus.value = "connecting";
    reconnectAttempts++;

    const wsUrl = `${config.public.wsUrl}/api/v1/ws/notifications`;

    console.log(
      `[WS] 🔌 Connecting (attempt ${reconnectAttempts}/${maxReconnectAttempts})`
    );

    try {
      if (ws) {
        ws.close(1000, "Reconnecting");
        ws = null;
      }

      const urlWithToken = `${wsUrl}?token=${encodeURIComponent(token)}`;
      ws = new WebSocket(urlWithToken);

      ws.onopen = () => {
        globalStatus.value = "connected";
        isConnecting = false;
        reconnectAttempts = 0;
        console.log("[WS] ✅ Connected successfully");

        ws?.send(JSON.stringify({ type: "auth", token }));

        if (pingInterval) {
          clearInterval(pingInterval);
        }

        pingInterval = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);

          const notification: Notification = {
            type: (parsedData.type || "unknown") as NotificationType,
            data: {
              ...parsedData.data,
              timestamp: Date.now(),
            },
            timestamp: Date.now(),
          };

          globalNotifications.value = [
            notification,
            ...globalNotifications.value,
          ].slice(0, 50);

          switch (notification.type) {
            case "connected":
              console.log("[WS] 🟢 Server confirmed connection");
              break;

            case "achievement_earned":
              console.log("[WS] 🏆 Achievement earned:", notification.data);
              globalLastAchievement.value = notification.data;

              const achievementTimestamp = Date.now();
              globalAchievementQueue.value.push({
                ...notification.data,
                timestamp: achievementTimestamp,
              });

              setTimeout(() => {
                const index = globalAchievementQueue.value.findIndex(
                  (a) => a.timestamp === achievementTimestamp
                );
                if (index > -1) {
                  globalAchievementQueue.value.splice(index, 1);
                }
              }, 6000);
              break;

            case "ping":
              ws?.send("pong");
              break;

            case "pong":
              break;

            case "error":
              console.error("[WS] ❌ Server error:", notification.data);
              break;

            default:
              console.log("[WS] 📩 Message:", notification.type);
          }
        } catch (e) {
          console.error("[WS] Parse error:", e, event.data);
        }
      };

      ws.onerror = () => {
        console.error("[WS] ❌ Connection error");
        isConnecting = false;
      };

      ws.onclose = (event) => {
        globalStatus.value = "disconnected";
        isConnecting = false;

        console.log(`[WS] 🔌 Disconnected (code: ${event.code})`);

        if (pingInterval) {
          clearInterval(pingInterval);
          pingInterval = null;
        }

        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(5000 * reconnectAttempts, 30000);
          console.log(`[WS] 🔄 Reconnecting in ${delay / 1000}s...`);
          reconnectTimer = setTimeout(connect, delay);
        }
      };
    } catch (error) {
      globalStatus.value = "disconnected";
      isConnecting = false;
      console.error("[WS] Connection failed:", error);
    }
  };

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }

    if (ws) {
      ws.close(1000, "User disconnected");
      ws = null;
    }

    globalStatus.value = "disconnected";
    isConnecting = false;
    reconnectAttempts = 0;
  };

  const tokenCookie = useCookie("access_token");
  watch(
    () => tokenCookie.value,
    (newToken) => {
      if (newToken) {
        reconnectAttempts = 0;
        connect();
      } else {
        disconnect();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {});

  const removeFromQueue = (timestamp: number) => {
    globalAchievementQueue.value = globalAchievementQueue.value.filter(
      (a) => a.timestamp !== timestamp
    );
  };

  return {
    status: globalStatus,
    lastAchievement: globalLastAchievement,
    achievementQueue: globalAchievementQueue,
    notifications: globalNotifications,
    connect,
    disconnect,
    removeFromQueue,
  };
};
