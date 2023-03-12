# Flex Conversations
This project contains a simple Flex plugin to park conversations along with serverless functions to remove and add an agent back to an interaction.

### Removing an agent from a conversation
The `remove_participant.ts` function shows removing an conversation particpant

This is called from the Plugin if we see error 50433

### Removing an agent from an interaction but keeping the conversation open
The `remove_agent.ts` function shows how to remove a agent as a participant to the interaction

### Adding an agent from a conversation 
The `add_agent.ts` function shows how invite an agent to an existing conversation
