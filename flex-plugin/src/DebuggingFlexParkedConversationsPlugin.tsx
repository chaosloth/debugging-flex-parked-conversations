import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { CustomizationProvider } from "@twilio-paste/core/customization";
import { registerActions } from "./actions/action";
import { registerNotifications } from "./notifications/notifications";
import { LeaveConversationButton } from "./components/LeaveConversationButton";
import { ContentFragmentConditionFunction, Tab } from "@twilio/flex-ui";
import ConversationHistory from "./views/ConversationHistoryTab";

const PLUGIN_NAME = "DebuggingFlexParkedConversationsPlugin";

export default class DebuggingFlexParkedConversationsPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    // Add Paste
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    /**************************************
     *
     *  Register our leave chat action
     *  See: actions/action.ts
     *
     **************************************/
    registerActions(flex, manager);

    /**************************************
     *
     *  Register our user notifications
     *  See: notifications/notifications.ts
     *
     **************************************/
    registerNotifications(flex, manager);

    /**************************************
     *
     *  Add a button to leave the conversation
     *  See: components/LeaveConversationButton.tsx
     *
     **************************************/
    flex.TaskCanvasHeader.Content.add(
      <LeaveConversationButton key="leave-conversation-button" />,
      {
        sortOrder: 1,
        if: (props) =>
          props.channelDefinition.capabilities.has("Chat") &&
          props.task.taskStatus === "assigned",
      }
    );

    /**************************************
     *  Check if tab should be displayed
     **************************************/
    const shouldDisplayTab: ContentFragmentConditionFunction = (props) => {
      const t = props.task;
      if (t && t.attributes?.conversationSid) return true;
      return false;
    };

    /**************************************
     *  Add the tab
     **************************************/
    flex.TaskCanvasTabs.Content.add(
      <Tab
        uniqueName="conversation-history-preview"
        key="conversation-history-preview"
        label="Conversation History"
      >
        <ConversationHistory />
      </Tab>,
      {
        sortOrder: -1,
        if: shouldDisplayTab,
      }
    );
  }
}
