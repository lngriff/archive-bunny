import { exec } from 'child_process';
import * as readline from 'readline';
import * as bunny from './bunny.js';
import {config } from './config.js';
import { archiveScript } from './archive-script.js';

function askQuestion(rl, question) {
    rl.setPrompt(question);
    rl.prompt();

    return new Promise((resolve, reject) => {
        rl.on('line', (userInput) => {
            resolve(userInput);
        });
    });
}

export async function launch(){
    process.stdout.write(bunny.startBunny);
    // this exec isnt very safe but it's your computer, you can do bad stuff if you want
    exec(`start chrome --remote-debugging-port=9222`);
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let ready = false;
    // give the user a couple tries to type "y"
    for (let i = 0; i < 3; i++) {
        ready = await askQuestion(rl, bunny.readyYet) == 'y';
        if (ready) break;
    }

    if (!ready) {
        process.stdout.write(`Looks like you're not ready yet. Why don't you try again later? Exiting process.`)
        process.exit();
    }
    
    const categories = await askQuestion(rl, bunny.getNames);
    rl.close();
    const split = categories.split(',').map((cat) => {
        return cat.trim();
    });

    await archiveScript(split);
    process.stdout.write('Thanks for using Archive Bunny!');
    process.exit();
}

export function printConfig(){
    // should probably find a way to print this prettier lol
    process.stdout.write(config.toString());
}

export function openConfig(){
    exec(`start ./src/config.js`);
}
