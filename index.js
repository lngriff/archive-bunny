#!/usr/bin/env node

import { Command } from 'commander';
import * as bunny from './src/bunny.js';
import * as commands from './src/commands.js';

const program = new Command();

program.name('archbunny')
    .description(bunny.usage)
    .version('1.0.0')
    .option('-run', 'launch browser and archive something(s)')
    .option('-view-config', 'view current config')
    .option('-edit-config', 'edit current config in default js editor')
    .option('-about', 'some extra details and help')
    .parse(process.argv);

const options = program.opts();

if (options.Run) {
    commands.launch();
}

if (options.ViewConfig) {
    commands.printConfig()
}

if (options.EditConfig) {
    commands.editConfig()
}

if (options.About) {
    // this is hideous rn, how do I display tons of text prettily
    process.stdout.write(bunny.about)
}

// TODO: if no options, show help
