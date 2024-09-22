#!/usr/bin/env node

const { program } = require('commander')
const init = require("./commands/init")
const deploy = require("./commands/deploy")
const reset = require("./commands/reset")
const removeApp = require('./commands/delete')
const createApp = require('./commands/create')
const showKey = require("./commands/showKey")

const VERSION = "1.0.1"

// version
program
    .version( VERSION )
    .description( "CLI for DroidScript Cloud" )

// init
program
    .command( "init" )
    .description( "Initialize DroidScript Cloud CLI" )
    .action( init )

// deploy
program
    .command('deploy')
    .description('Deploy a local project to DS cloud')
    .option('-s, --server', 'Deploy as a nodejs server')
    .option('-w, --website', 'Deploy as a static website')
    .action( deploy )

// reset
program
    .command('reset')
    .description('Clear all DS cloud data in this machine')
    .action( reset )

// delete
program
    .command('delete')
    .argument('<app-name>', 'The app name to delete')
    .description('Delete an app in DroidScript cloud')
    .action( removeApp )

// create
program
    .command('create')
    .argument('<app-name>', 'The nodejs server app name')
    .description('Create an app in DroidScript cloud')
    .action( createApp )

// create
program
    .command('key')
    .description('Display cloud key')
    .action( showKey )

// Parse the arguments
program.parse( process.argv )

// Show help if no arguments are provided
if( !process.argv.slice(2).length ) {
    program.outputHelp()
}
