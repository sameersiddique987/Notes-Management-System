import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

import ResponsiveAppBar from "./component/ResponsiveAppBar";
import WhatsAppButton from "./component/Button/WhatsAppButton";

const socket = io("https://notes-management-system-backend.vercel.app", {
  withCredentials: true,
});

function Layout() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      socket.emit("register", user._id);
      console.log("📨 Registered user with ID:", user._id);
    }

    socket.on("notification", (message) => {
      console.log("🔔 Received notification:", message);
      setNotifications((prev) => [...prev, message]);
      alert(message);
    });

    return () => {
      socket.off("connect");
      socket.off("notification");
    };
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
      <WhatsAppButton />
    </>
  );
}

export default Layout;
