// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";
import { InteractionChannelParticipantStatus } from "twilio/lib/rest/flexApi/v1/interaction/interactionChannel/interactionChannelParticipant";
const TokenValidator = require("twilio-flex-token-validator").functionValidator;

type MyContext = {};

type MyEvent = {
  flexInteractionSid: string;
  flexInteractionChannelSid: string;
  flexInteractionParticipantSid: string;
  status: InteractionChannelParticipantStatus; // "closed" or "wrapup"
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> =
  TokenValidator(
    async (
      context: Context<MyContext>,
      event: MyEvent,
      callback: ServerlessCallback
    ) => {
      console.log(">> Incoming event /api/remove_agent", event);
      const response = new Twilio.Response();

      response.appendHeader("Access-Control-Allow-Origin", "*");
      response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
      response.appendHeader("Content-Type", "application/json");
      response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

      /**************************************
       * Check we have a interaction SID
       **************************************/
      if (!event.flexInteractionSid) {
        response.setBody({
          status: "error",
          reason: "missing flexInteractionSid",
        });
        response.setStatusCode(400);
        console.error("Missing attribute flexInteractionSid");
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
        console.error("Missing attribute flexInteractionChannelSid");
        return callback(null, response);
      }

      /**************************************
       * Check we have a conversation SID
       **************************************/
      if (!event.flexInteractionParticipantSid) {
        response.setBody({
          status: "error",
          reason: "missing conversation flexInteractionParticipantSid",
        });
        response.setStatusCode(400);
        console.error("Missing attribute flexInteractionParticipantSid");
        return callback(null, response);
      }

      /**************************************
       * Check we have a status
       **************************************/
      if (!event.status) {
        response.setBody({
          status: "error",
          reason: "missing status",
        });
        response.setStatusCode(400);
        console.error("Missing attribute status");
        return callback(null, response);
      }

      let client = context.getTwilioClient();

      client.flexApi.v1
        .interaction(event.flexInteractionSid)
        .channels(event.flexInteractionChannelSid)
        .participants(event.flexInteractionParticipantSid)
        .update({ status: event.status })
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
    }
  );
