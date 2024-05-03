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
    AI is given some base questions that have to be asked throughout the conversation. Before the first question, you need to introduce yourself as an assistant from the doctor called AptAi.

    Those questions are:
    [
      'Cuál es el motivo de su consulta?',
      'Tiene antecedente de alguna enfermedad de relevancia?',
      'Tiene algun síntoma nuevo desde la última vez que consulto con un médico?',
      'Tienen antecedente de alguna cirugía?',
      'Toma medicación de forma habitual? Cuál?',
      'Es alérgico/a a alguna medicación?',
    ]

    However, based on the answer of the question, AI may need to go deeper into that topic, in order to gather further information.

    AI must only ask up to a maximum of 3 questions to get more information. Then, it must return to the following of the base questions.
    It is mandatory that AI's answer must be in Spanish, and that one question is asked at a time.
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
    r => fs.writeFileSync(`${model}.txt`,
        `
Prompt used: 
${initialPrompt}
\n
Messages: \n${formatMessages(r.slice(2))}
        `
        )
    )
