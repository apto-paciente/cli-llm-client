## Prompt testing CLI

This is a simple node program that allows you to test prompts 
with APTO's api from the command line.

### Installation

```bash
npm install
```

### Usage


Run the main program with the following command:
```bash
node conversation.js
```

The conversation will start and you will be prompted to enter a message.

Once the model answers NO_FURTHER_QUESTIONS, type exit to save the conversation to a file.

<b>Note:</b> If the filepath is not changed in the conversation.js file, the same file will be overwritten every time
