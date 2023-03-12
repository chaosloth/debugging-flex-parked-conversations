// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

import { InteractionChannelInviteListInstanceCreateOptions } from "twilio/lib/rest/flexApi/v1/interaction/interactionChannel/interactionChannelInvite";

type MyContext = {
  FLEX_WORKSPACE_SID: string;
  FLEX_WORKFLOW_SID: string;
};

type MyEvent = {
  flexInteractionSid: string;
  flexInteractionChannelSid: string;
  routing: InteractionChannelInviteListInstanceCreateOptions["routing"];
};

const TokenValidator = require("twilio-flex-token-validator").functionValidator;

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (
  context: Context<MyContext>,
  event: MyEvent,
  callback: ServerlessCallback
) => {
  const response = new Twilio.Response();

  /**************************************
   *
   * TODO:
   * !!! VALIDATE THE REQUEST TOKEN !!!
   *
   **************************************/

  /**************************************
   * Check we have a interaction SID
   **************************************/
  if (!event.flexInteractionSid) {
    response.setBody({
      status: "error",
      reason: "missing flexInteractionSid",
    });
    response.setStatusCode(400);
    return callback(null, response);
  }

  /**************************************
   * Check we have a channel SID
   **************************************/
  if (!event.flexInteractionChannelSid) {
    response.setBody({
      status: "error",
      reason: "missing flexInteractionChannelSid",
    });
    response.setStatusCode(400);
    return callback(null, response);
  }

  let client = context.getTwilioClient();

  /***********************************************************************
   *  This will cause the Flex Interactions to create a new task
   *  Task parameters (or conversation attributes) can be attached here
   *  For example: Participant's name etc
   ***********************************************************************/
  const routingParams = {
    properties: {
      task_channel_unique_name: "chat",
      workspace_sid: context.FLEX_WORKSPACE_SID,
      workflow_sid: context.FLEX_WORKFLOW_SID,
    },
  };

  client.flexApi.v1
    .interaction(event.flexInteractionSid)
    .channels(event.flexInteractionChannelSid)
    .invites.create({
      routing: routingParams,
    })
    .then(() => {
      response.setBody({ status: "success" });
      return callback(null, response);
    })
    .catch((err) => {
      response.setStatusCode(500);
      console.error("Error occurred calling API", err);
      response.setBody({ status: "error", reason: "exception" });
      return callback(null, response);
    });
};
