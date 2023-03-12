import { MessagingCanvas, withTaskContext } from "@twilio/flex-ui";
import React from "react";

export type ConversationHistoryProps = {
  task: any;
};

const ConversationHistory = (props: ConversationHistoryProps) => {
  // Show transcript if we have a CallSid
  if (props.task?.attributes?.conversationSid)
    return (
      <MessagingCanvas
        sid={props.task?.attributes?.conversationSid}
        autoInitChannel={true}
        key="chat-history-message-canvas"
        inputDisabledReason="Chat input disabled"
        charLimit={0}
      />
    );

  return <div>No call SID</div>;
};

export default withTaskContext(ConversationHistory);
