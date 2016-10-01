/* Command Class parses raw text message into action specific data
*  @param rawText : string
*  @param validCmds : array
*/
class Command {
  constructor(rawData, validCmds) {
    this.rawData = rawData;
    this.validCmds = validCmds;
    this.cmd = '';
  }

  valid() {
    return this.validCmds.some(
      validCmd => this.cmd === validCmd
    );
  }
}

/* Action Class executes data based on given command
*  @param command : string
*/
class Action {
  constructor(command) {
    this.command = command;
  }
}

module.exports = { Command, Action };
