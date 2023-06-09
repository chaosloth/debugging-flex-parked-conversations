import { ActionFunction, Actions, Notifications } from "@twilio/flex-ui";
import * as Flex from "@twilio/flex-ui";
import { getMyParticipantSid } from "../utils/utils";

export const registerActions = async (
  flex: typeof Flex,
  manager: Flex.Manager
) => {
  /******************************************************
   *
   * Ensure task is a Conversation Based Messaging task
   *
   ******************************************************/

  if (manager && manager.workerClient) {
    manager.workerClient.on("reservationCreated", function (reservation) {
      reservation.on(
        "canceled",
        (payload: {
          canceledReasonCode: number;
          task: { attributes: { conversationSid: any } };
        }) => {
          if (payload.canceledReasonCode === 50433) {
            const body = {
              Token: manager.user.token,
              conversationSid: payload.task.attributes.conversationSid,
              identity:
                Flex.Manager.getInstance().conversationsClient.user.identity,
            };

            const url = `${process.env.FLEX_APP_SERVERLESS_DOMAIN}/api/remove_participant`;

            if (!url) {
              console.log(
                "reservationCreated workaround error, URL not configured"
              );
              return;
            }

            fetch(url, {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
              .then((response) => {
                /****************************************************
                 *
                 * Tell the we removed them from the conversation
                 *
                 ****************************************************/
                Notifications.showNotification("leftConversation");
                console.log(
                  "reservationCreated workaround have left the conversation"
                );
              })
              .catch(async (err) => {
                /****************************************************
                 *
                 * Tell the user an issue occured
                 *
                 ****************************************************/
                Notifications.showNotification("leftConversationError");
                console.log(
                  "reservationCreated workaround error attempting to leave",
                  err
                );
              });
          }
        }
      );
    });
  }

  const leaveConversation: ActionFunction = async (payload: any) => {
    console.log("LeaveConversation action fired");
    /******************************************************
     *
     * Ensure task is a Conversation Based Messaging task
     *
     ******************************************************/

    if (!Flex.TaskHelper.isCBMTask(payload.task)) {
      console.log("LeaveConversation attempting to leave - not a CBM task");
      return;
    }
    /****************************************************
     *
     * Leave the conversation
     *
     ***************************************************/

    console.log("LeaveConversation attempting to leave for task", payload.task);

    const participants = await payload.task.getParticipants(
      payload.task.attributes.flexInteractionChannelSid
    );
    const myParticipantSid = getMyParticipantSid(participants);

    let params = {
      Token: manager.user.token,
      flexInteractionSid: payload.task.attributes.flexInteractionSid,
      flexInteractionChannelSid:
        payload.task.attributes.flexInteractionChannelSid,
      flexInteractionParticipantSid: myParticipantSid,
      status: "closed",
    };

    const url = `${process.env.FLEX_APP_SERVERLESS_DOMAIN}/api/remove_agent`;

    if (!url) {
      console.log("LeaveConversation error, URL not configured");
      return;
    }

    fetch(url, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
      .then((response) => {
        /****************************************************
         *
         * Tell the user they've left the conversation
         *
         ****************************************************/
        Notifications.showNotification("leftConversation");
        console.log("LeaveConversation have left the conversation");
      })
      .catch(async (err) => {
        /****************************************************
         *
         * Tell the user an issue occured
         *
         ****************************************************/
        Notifications.showNotification("leftConversationError");
        console.log("LeaveConversation error attempting to leave", err);
      });
  };

  /**************************************************************
   *
   * Register the Flex Action to be called from other components
   *
   **************************************************************/
  Actions.registerAction("LeaveConversation", (action) =>
    leaveConversation(action)
  );
};
