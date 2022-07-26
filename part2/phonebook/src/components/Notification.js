import React from "react";
import "./Notification.css";

export default function Notification({ message }) {
  if (message === null) {
    return null;
  }
  if (message.includes("failed")) {
    return <div className="error-message">{message}</div>;
  }

  return <div className="success-message">{message}</div>;
}
