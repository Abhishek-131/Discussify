import Notification from "../models/Notification.js";

export const notifyUsers = async ({ users, message, link }) => {
  const notifications = users.map((u) => ({
    user: u,
    message,
    link,
  }));
  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
};
