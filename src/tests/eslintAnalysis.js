const fs = require('fs');
const { exec } = require('child_process');
const ERROR_MSG_CHAR_COUNT = 157;
const LINE_NUM_PAD_COUNT = 5;
/**
 * Runs eslint in a subprocess, reads the standard output or errors and generates an ASCII formatted report synthesizing eslint results.
 * exec is typically used for running commands where you expect the output to be relatively small and can be buffered entirely in memory.
 * The entire output of the command (both stdout and stderr) is buffered in memory and provided as strings to the callback function once the command completes.
 */
exec('npx eslint .', (error, stdout, stderr) => {
  try {
    const linterErrorLines = stdout.split(/\r?\n/); // regular expression splitting at linebreaks on either unix or windows OS
    // splitting at newline results in last element of array to be empty string. pop it off.
    if (linterErrorLines && linterErrorLines.length > 1) linterErrorLines.pop();
    // construct log string of linter errors and pad empty spaces
    let linterErrorString = '';
    linterErrorLines.forEach((line, index) => {
      linterErrorString += padLinesAndAddLinenumbers(
        line,
        ERROR_MSG_CHAR_COUNT,
        LINE_NUM_PAD_COUNT,
        index + 1,
        '-'
      ).concat(`\n`);
    });
    const noLinterErrorMessage = `
                              __________________________________________________________________________
                             |        __                 ___  ___  __      ___  __   __   __   __   __  |
                             |  |\\ | /  \\    |    | |\\ |  |  |__  |__)    |__  |__) |__) /  \\ |__) /__\` |
                             |  | \\| \\__/    |___ | | \\|  |  |___ |  \\    |___ |  \\ |  \\ \\__/ |  \\ .__/ |
                             |__________________________________________________________________________|
`;
    const typeCheckReport = `
 ___________________________  _________________________________________________________________________________________________________________________________________________
|       __                  ||                     _ _       _                  _                  _               _                        _               _                  |
| |\\ | |__) \\_/             ||            ___  ___| (_)_ __ | |_            ___| |_ __ _ _ __   __| | __ _ _ __ __| |            ___  _   _| |_ _ __  _   _| |_                |
| | \\| |    / \\             ||           / _ \\/ __| | | '_ \\| __|          / __| __/ _\` | '_ \\ / _\` |/ _\` | '__/ _\` |           / _ \\| | | | __| '_ \\| | | | __|               |
|                           ||          |  __/\\__ \\ | | | | | |_           \\__ \\ || (_| | | | | (_| | (_| | | | (_| |          | (_) | |_| | |_| |_) | |_| | |_                |
|  ___  __              ___ ||           \\___||___/_|_|_| |_|\\__|          |___/\\__\\__,_|_| |_|\\__,_|\\__,_|_|  \\__,_|           \\___/ \\__,_|\\__| .__/ \\__,_|\\__|               |
| |__  /__\` |    | |\\ |  |  ||                                                                                                                 |_|                             |
| |___ .__/ |___ | | \\|  |  ||                                                                                                                                                 |
|___________________________||_________________________________________________________________________________________________________________________________________________|

`
      .concat(linterErrorLines && linterErrorLines.length > 1 ? linterErrorString : noLinterErrorMessage)
      .concat(
        stderr && stderr.length > 0
          ? `

                   _ _       _            _                  _               _      _____ ____  ____   ___  ____
          ___  ___| (_)_ __ | |_      ___| |_ __ _ _ __   __| | __ _ _ __ __| |    | ____|  _ \\|  _ \\ / _ \\|  _ \\
         / _ \\/ __| | | '_ \\| __|    / __| __/ _\` | '_ \\ / _\` |/ _\` | '__/ _\` |    |  _| | |_) | |_) | | | | |_) |
        |  __/\\__ \\ | | | | | |_     \\__ \\ || (_| | | | | (_| | (_| | | | (_| |    | |___|  _ <|  _ <| |_| |  _ <
         \\___||___/_|_|_| |_|\\__|    |___/\\__\\__,_|_| |_|\\__,_|\\__,_|_|  \\__,_|    |_____|_| \\_\\_| \\_\\\\___/|_| \\_\\

`
          : ''
      )
      .concat(stderr);

    fs.writeFileSync('reports/eslint-analysis.txt', typeCheckReport);
    console.log('Written eslint analysis to eslint-analysis.txt');
    console.log(typeCheckReport);
  } catch (error) {
    console.log('Error constructing eslint analysis report: ' + error);
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
  // if value is an empty string, we remove a whitespace and add one fillstring at the end to ensure equal length of fillString rows to value rows
  return `  ${startPadding} ${lineNum} ${startPaddingEnd}   ${value}${!value ? '' : ' '}${endPadding}${!value ? fillString : ''}`;
}
