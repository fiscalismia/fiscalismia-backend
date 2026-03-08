const fs = require('fs');
const { exec } = require('child_process');
const ERROR_MSG_CHAR_COUNT = 167;
const LINE_NUM_PAD_COUNT = 5;

/**
 * Runs snyk security analysis in a subprocess, reads the standard output or errors and generates an ASCII formatted report synthesizing snyk results.
 * exec is typically used for running commands where you expect the output to be relatively small and can be buffered entirely in memory.
 * The entire output of the command (both stdout and stderr) is buffered in memory and provided as strings to the callback function once the command completes.
 */
exec('npx snyk test', (error, stdout, stderr) => {
  try {
    const snykErrorLines = stdout.split(/\r?\n/); // regular expression splitting at linebreaks on either unix or windows OS
    // splitting at newline results in last element of array to be empty string. pop it off.
    if (snykErrorLines && snykErrorLines.length > 1) snykErrorLines.pop();
    // construct log string of linter errors and pad empty spaces
    let snykErrorString = '';
    let currentLine;
    let currentLineNum = 0;
    snykErrorLines.forEach((line) => {
      currentLine = line;
      while (currentLine && currentLine.length > ERROR_MSG_CHAR_COUNT) {
        // break lines if output is larger than ERROR_MSG_CHAR_COUNT
        snykErrorString += padLinesAndAddLinenumbers(
          currentLine.substring(0, ERROR_MSG_CHAR_COUNT - 1),
          ERROR_MSG_CHAR_COUNT,
          LINE_NUM_PAD_COUNT,
          (currentLineNum += 1),
          '-'
        ).concat(`\n`);
        currentLine = `   ${currentLine.substring(ERROR_MSG_CHAR_COUNT - 1)}`;
      }
      snykErrorString += padLinesAndAddLinenumbers(
        currentLine,
        ERROR_MSG_CHAR_COUNT,
        LINE_NUM_PAD_COUNT,
        (currentLineNum += 1),
        '-'
      ).concat(`\n`);
    });
    const noSnykErrorMessage = `
                                        ___________________________________________________________________________
                                       |          __      __                    ___  __   __   __   __   __        |
                                       |    |\\ | /  \\    /__\` |\\ | \\ / |__/    |__  |__) |__) /  \\ |__) /__\`       |
                                       |    | \\| \\__/    .__/ | \\|  |  |  \\    |___ |  \\ |  \\ \\__/ |  \\ .__/       |
                                       |___________________________________________________________________________|
`;
    const snykCodeAnalysisReport = `
 _____________________________________  ________________________________________________________________________________________________________________________________________________
|                                     ||                          _              _                           _                                               _           _              |
|       __          __                ||          ___ _ __  _   _| | __       __| | ___ _ __   ___ _ __   __| | ___ _ __   ___ _   _        __ _ _ __   __ _| |_   _ ___(_)___          |
| |\\ | |__) \\_/    /__\` |\\ | \\ / |__/ ||         / __| '_ \\| | | | |/ /      / _\` |/ _ \\ '_ \\ / _ \\ '_ \\ / _\` |/ _ \\ '_ \\ / __| | | |      / _\` | '_ \\ / _\` | | | | / __| / __|         |
| | \\| |    / \\    .__/ | \\|  |  |  \\ ||         \\__ \\ | | | |_| |   <      | (_| |  __/ |_) |  __/ | | | (_| |  __/ | | | (__| |_| |     | (_| | | | | (_| | | |_| \\__ \\ \\__ \\         |
|          ___  ___  __  ___          ||         |___/_| |_|\\__, |_|\\_\\      \\__,_|\\___| .__/ \\___|_| |_|\\__,_|\\___|_| |_|\\___|\\__, |      \\__,_|_| |_|\\__,_|_|\\__, |___/_|___/         |
|           |  |__  /__\`  |           ||                    |___/                      |_|                                     |___/                           |___/                    |
|           |  |___ .__/  |           ||                                                                                                                                                |
|_____________________________________||________________________________________________________________________________________________________________________________________________|

`
      .concat(snykErrorLines && snykErrorLines.length > 1 ? snykErrorString : noSnykErrorMessage)
      .concat(
        stderr && stderr.length > 0
          ? `
                _                  _               _      _____ ____  ____   ___  ____
            ___| |_ __ _ _ __   __| | __ _ _ __ __| |    | ____|  _ \\|  _ \\ / _ \\|  _ \\
           / __| __/ _\` | '_ \\ / _\` |/ _\` | '__/ _\` |    |  _| | |_) | |_) | | | | |_) |
           \\__ \\ || (_| | | | | (_| | (_| | | | (_| |    | |___|  _ <|  _ <| |_| |  _ <
           |___/\\__\\__,_|_| |_|\\__,_|\\__,_|_|  \\__,_|    |_____|_| \\_\\_| \\_\\\\___/|_| \\_\\
`
          : ''
      )
      .concat(stderr);

    fs.writeFileSync('reports/snyk-dependency-analysis.txt', snykCodeAnalysisReport);
    console.log('Written snyk static dependency analysis to snyk-dependency-analysis.txt');
    console.log(snykCodeAnalysisReport);
  } catch (error) {
    console.log('Error constructing snyk dependency analysis report: ' + error);
  }
});

// helper function formatting each line in the format:
//   ------ 1 ------   errorMessage -----------
//   ------ 2 ------   errorMessage -----------
function padLinesAndAddLinenumbers(value, width, startWidth, lineNum, fillString) {
  const paddingLength = width - value.toString().length;
  const startPadding = fillString.repeat(startWidth);
  const startPaddingEnd = fillString.repeat(lineNum > 99 ? startWidth - 2 : lineNum > 9 ? startWidth - 1 : startWidth);
  if (paddingLength < 0) return `  ${startPadding} ${lineNum} ${startPaddingEnd}  ${value}`;
  const endPadding = fillString.repeat(paddingLength);
  // if value is an empty string, we remove a whitespace and add one fillstring at the end to ensure equal length of fillString rows to value rows
  return `  ${startPadding} ${lineNum} ${startPaddingEnd}  ${value}${!value ? '' : ' '}${endPadding}${!value ? fillString : ''}`;
}
