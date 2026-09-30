class NotificationState {
  constructor(config) {
    this.tab = config.tab;
    this.condition = config.condition;
  }
}

export const Notifications = GameDatabase.notifications.map(config => new NotificationState(config));

export function getNotification() {
  for (const notification of Notifications) {
    if (notification.condition()) return notification.tab;
  }
  return null;
}