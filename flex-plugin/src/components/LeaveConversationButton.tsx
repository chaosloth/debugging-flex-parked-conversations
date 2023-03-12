import React, { useEffect, useState } from "react";
import { Actions, styled, withTaskContext } from "@twilio/flex-ui";
import { Box, Button, Spinner } from "@twilio-paste/core";
import * as Flex from "@twilio/flex-ui";

type LeaveConversationButtonProps = {
  task?: Flex.ITask;
};

const ButtonContainer = styled.div`
  margin: auto;
  padding-right: 0.8em;
`;

export const LeaveConversationButton = (
  props: LeaveConversationButtonProps
) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, [loading]);

  return (
    <ButtonContainer>
      <Button
        onClick={() => {
          console.log("LeaveConversation clicked");
          setLoading(true);
          Actions.invokeAction("LeaveConversation", { task: props.task });
        }}
        variant={"primary"}
        size="small"
        disabled={loading}
      >
        {loading && (
          <div style={{ width: "15px" }}>
            <Spinner
              size={"sizeIcon100"}
              title={"Requesting"}
              decorative={true}
            />
          </div>
        )}
        Leave Conversation
      </Button>
    </ButtonContainer>
  );
};

export default withTaskContext(LeaveConversationButton);
