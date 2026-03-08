const fs = require('fs');
const { exec } = require('child_process');
const ERROR_MSG_CHAR_COUNT = 138;
const LINE_NUM_PAD_COUNT = 6;

/**
 * Runs typescript compile in a subprocess, reads the standard output or errors and generates an ASCII formatted report synthesizing tsc results.
 * exec is typically used for running commands where you expect the output to be relatively small and can be buffered entirely in memory.
 * The entire output of the command (both stdout and stderr) is buffered in memory and provided as strings to the callback function once the command completes.
 */
exec('npx tsc -b --noEmit', (error, stdout, stderr) => {
  try {
    // --noEmit flag produces no compiled files but simple returns the compilation errors, or nothing.
    const compilerErrorLines = stdout.split(/\r?\n/); // regular expression splitting at linebreaks on either unix or windows OS
    // splitting at newline results in last element of array to be empty string. pop it off.
    if (compilerErrorLines && compilerErrorLines.length > 1) compilerErrorLines.pop();
    // construct log string of compile errors and pad empty spaces
    let compilerErrorString = '';
    compilerErrorLines.forEach((line, index) => {
      compilerErrorString += padLinesAndAddLinenumbers(
        line,
        ERROR_MSG_CHAR_COUNT,
        LINE_NUM_PAD_COUNT,
        index + 1,
        '-'
      ).concat(`\n`);
    });
    const noCompilerErrorMessage = `
                    ________________________________________________________________________________________________________
                   |           __      __   __         __              ___    __           ___  __   __   __   __   __      |
                   |     |\\ | /  \\    /  \` /  \\  |\\/| |__) | |     /\\   |  | /  \\ |\\ |    |__  |__) |__) /  \\ |__) /__\`     |
                   |     | \\| \\__/    \\__, \\__/  |  | |    | |___ /~~\\  |  | \\__/ | \\|    |___ |  \\ |  \\ \\__/ |  \\ .__/     |
                   |________________________________________________________________________________________________________|
`;
    const typeCheckReport = `
   _______________  __________________________________________________________________________________________________________________________________________
  |       __      ||   _____                                _       _             ____                      _ _                ____                 _ _       |
  | |\\ | |__) \\_/ ||  |_   _|   _ _ __   ___  ___  ___ _ __(_)_ __ | |_          / ___|___  _ __ ___  _ __ (_) | ___          |  _ \\ ___  ___ _   _| | |_     |
  | | \\| |    / \\ ||    | || | | | '_ \\ / _ \\/ __|/ __| '__| | '_ \\| __|        | |   / _ \\| '_ \` _ \\| '_ \\| | |/ _ \\         | |_) / _ \\/ __| | | | | __|    |
  | ___  __   __  ||    | || |_| | |_) |  __/\\__ \\ (__| |  | | |_) | |_         | |__| (_) | | | | | | |_) | | |  __/         |  _ <  __/\\__ \\ |_| | | |_     |
  |  |  /__\` /  \` ||    |_| \\__, | .__/ \\___||___/\\___|_|  |_| .__/ \\__|         \\____\\___/|_| |_| |_| .__/|_|_|\\___|         |_| \\_\\___||___/\\__,_|_|\\__|    |
  |  |  .__/ \\__, ||        |___/|_|                         |_|                                     |_|                                                      |
  |_______________||__________________________________________________________________________________________________________________________________________|

`
      .concat(compilerErrorLines && compilerErrorLines.length > 1 ? compilerErrorString : noCompilerErrorMessage)
      .concat(
        stderr && stderr.length > 0
          ? `
  _____                                _       _        ____                      _ _          _____
 |_   _|   _ _ __   ___  ___  ___ _ __(_)_ __ | |_     / ___|___  _ __ ___  _ __ (_) | ___    | ____|_ __ _ __ ___  _ __ ___
   | || | | | '_ \\ / _ \\/ __|/ __| '__| | '_ \\| __|   | |   / _ \\| '_ \` _ \\| '_ \\| | |/ _ \\   |  _| | '__| '__/ _ \\| '__/ __|
   | || |_| | |_) |  __/\\__ \\ (__| |  | | |_) | |_    | |__| (_) | | | | | | |_) | | |  __/   | |___| |  | | | (_) | |  \\__ \\
   |_| \\__, | .__/ \\___||___/\\___|_|  |_| .__/ \\__|    \\____\\___/|_| |_| |_| .__/|_|_|\\___|   |_____|_|  |_|  \\___/|_|  |___/
       |___/|_|                         |_|                                |_|
`
          : ''
      )
      .concat(stderr);

    fs.writeFileSync('reports/type-check-output.txt', typeCheckReport);
    console.log('Written TSC result to type-check-report.txt');
    console.log(typeCheckReport);
  } catch (error) {
    console.log('Error constructing type check report: ' + error);
  }
});

// helper function formatting each line in the format:
//   ------ 1 ------   errorMessage -----------
//   ------ 2 ------   errorMessage -----------
function padLinesAndAddLinenumbers(value, width, startWidth, lineNum, fillString) {
  const paddingLength = width - value.toString().length;
  const startPadding = fillString.repeat(startWidth);
  const startPaddingEnd = fillString.repeat(lineNum > 99 ? startWidth - 2 : lineNum > 9 ? startWidth - 1 : startWidth);
  if (paddingLength < 0) return `  ${startPadding} ${lineNum} ${startPaddingEnd}   ${value}`;
  const endPadding = fillString.repeat(paddingLength);
  return `  ${startPadding} ${lineNum} ${startPaddingEnd}   ${value} ${endPadding}`;
}
