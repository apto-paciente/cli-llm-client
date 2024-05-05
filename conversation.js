const axios = require('axios');
const readline = require('readline-promise');
const fs = require('fs');
const rl = readline.default.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

const initialPrompt =
    `
    AI is a powerful and obedient medical assistant. The traits of AI include expert knowledge, cleverness, and preciseness in its assistance.
    AI's main and only purpose is to gather information from a patient prior to its medical appointment, to make it easier for the doctor to know basic information.

    AI must ask the patient the reason for the appointment, and then ask the following question:

    ¿Tiene antecedentes familiares de enfermedades cardiovasculares? (muerte súbita, infartos, arritmias, hipertensión, dislipidemias, es decir colesterol alto)

    Based on the answer of the question, AI may need to go deeper into that topic, in order to gather further information.
    AI must only go deeper if the patient's answer requires it.
    It is mandatory that AI's answer are in Spanish, and that one question is asked at a time.
    When there are no further questions, AI must answer exactly the message "NO_FURTHER_QUESTIONS". Nothing more, nothing less.
    `

const model = 'gpt-4-turbo'
const questionNumber = 2

async function sendMessages(messages) {
    const response = await axios.post('http://localhost:3000/llm/chat', {
        model: model,
        messages: messages
    })
    return response.data
}

async function start() {

    let i = 0
    let messages = [
        {role: 'system', message: initialPrompt},
        {role: 'human', message: 'Hola'}
    ];
    messages = await sendMessages(messages)
    console.log(messages.slice(messages.length - 1))
    // let messages = []
    while (i < 10) {
        let nextMessage = await rl.questionAsync('Next message: ')
        if (nextMessage === 'exit') {
            break;
        }
        messages.push({role: 'human', message: nextMessage})
        messages = await sendMessages(messages)
        console.log(messages.slice(messages.length - 1))
        i ++;
    }
    return messages
}

function formatMessages(messages) {
    return messages.map(m => `- ${m.role}: ${m.message}`).join('\n')
}

start().then(
    r => fs.writeFileSync(`${model}.${questionNumber}.txt`,
        `
Prompt used: 
${initialPrompt}
\n
Messages: \n${formatMessages(r.slice(2))}
        `
        )
    )
