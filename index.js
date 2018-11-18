const Application = require('./src/application');
const argv = require('yargs')
    .usage('Usage: $0 [options]')
    .describe('i', 'File with employees. Should be in JSON format.')
    .describe('y', 'Year to get vacation days')
    .describe('o', 'File to save result')
    .demandOption(['i', 'y'])
    .default({'o': 'output.json'})
    .alias('i', 'input')
    .alias('y', 'year')
    .alias('o', 'output')
    .help(false)
    .version(false)
    .argv;

const year = argv.year;
const inputFileName = argv.input;
const outputFileName = argv.output || 'output.json';

process.on('uncaughtException', (err) => {
    console.log(`Unhandled Exception: ${err}\n`);
});
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

try {
    const results = Application.Start(inputFileName, outputFileName, year);
    console.log(`Operation completed.\nNumber of employees are ${results.length}.\nResults saved in ${outputFileName}`);

} catch (error) {
    console.log(`Unable to perform operation.\n${error.toString()}`);
}
