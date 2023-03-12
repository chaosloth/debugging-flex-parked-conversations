import * as Flex from "@twilio/flex-ui";

export const registerNotifications = async (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  flex.Notifications.registerNotification({
    id: "leftConversation",
    closeButton: true,
    content: "You have left the conversation!",
    timeout: 3000,
    type: Flex.NotificationType.success,
  });

  flex.Notifications.registerNotification({
    id: "leftConversationError",
    closeButton: true,
    content: "Could not remove participant from conversation!",
    timeout: 3000,
    type: Flex.NotificationType.error,
  });

  flex.Notifications.registerNotification({
    id: "leftConversationChatTask",
    closeButton: true,
    content: "Attempting to remove self from non-CBM task!",
    timeout: 3000,
    type: Flex.NotificationType.warning,
  });
};
