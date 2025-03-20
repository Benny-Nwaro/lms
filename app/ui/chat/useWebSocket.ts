import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = `${process.env.NEXT_PUBLIC_API_URL}/ws`;
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`;

export default function useWebSocket() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<
    { senderId: string; senderName: string; content: string; profileImageUrl: string }[]
  >([]);
  const [userDetails, setUserDetails] = useState<{ userId: string; firstName: string; profileImageUrl: string } | null>(
    null
  );

  // Fetch user details
  useEffect(() => {
    const getUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User ID or token not found in localStorage");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user details");

        const userData = await response.json();
        setUserDetails({
          userId: userId,
          firstName: userData.firstName,
          profileImageUrl: userData.profileImageUrl || "/default-avatar.png",
        });

        localStorage.setItem("firstName", userData.firstName);
        localStorage.setItem("profileImageUrl", userData.profileImageUrl || "/default-avatar.png");
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get JWT token

    const socket = new SockJS(SOCKET_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`, // Send JWT token
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        client.subscribe("/topic/public", (message) => {
          console.log("WebSocket Message Received: ", message.body);

          try {
            const receivedMessage = JSON.parse(message.body);
            console.log("Parsed Message: ", receivedMessage);

            setMessages((prevMessages) => [
              ...prevMessages,
              {
                senderId: receivedMessage.senderId,
                senderName: receivedMessage.senderName || "Unknown",
                content: receivedMessage.content,
                profileImageUrl: receivedMessage.profileImageUrl || "/default-avatar.png",
              },
            ]);
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        });
      },
      onStompError: (error) => {
        console.error("WebSocket Error:", error);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (stompClient && stompClient.connected && userDetails) {
      const chatMessage = {
        senderId: userDetails.userId,
        senderName: userDetails.firstName,
        profileImageUrl: userDetails.profileImageUrl,
        content: message,
        type: "CHAT",
      };

      console.log("Sending message:", chatMessage);

      stompClient.publish({ destination: "/app/chat.sendMessage", body: JSON.stringify(chatMessage) });
    } else {
      console.error("WebSocket not connected or userDetails missing.");
    }
  };

  return { messages, sendMessage };
}
