// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

const TokenValidator = require("twilio-flex-token-validator").functionValidator;

type MyContext = {};

type MyEvent = {
  conversationSid: string;
  identity: string;
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
       * Check we have a conversationSid
       **************************************/
      if (!event.conversationSid) {
        response.setBody({
          status: "error",
          reason: "missing conversationSid",
        });
        response.setStatusCode(400);
        console.error("Missing attribute conversationSid");
        return callback(null, response);
      }

      /**************************************
       * Check we have a identity
       **************************************/
      if (!event.identity) {
        response.setBody({
          status: "error",
          reason: "missing identity",
        });
        response.setStatusCode(400);
        console.error("Missing attribute identity");
        return callback(null, response);
      }

      let client = context.getTwilioClient();
      client.conversations.v1
        .conversations(event.conversationSid)
        .participants(event.identity)
        .remove()
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
