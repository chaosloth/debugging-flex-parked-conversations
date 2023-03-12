import * as Flex from "@twilio/flex-ui";

const manager: any | undefined = Flex.Manager.getInstance();

export const getMyParticipantSid = (participants: any): string => {
  const myParticipant = participants.find(
    (participant: any) =>
      participant.mediaProperties?.identity ===
      manager.conversationsClient?.user?.identity
  );

  return myParticipant ? myParticipant.participantSid : "";
};
