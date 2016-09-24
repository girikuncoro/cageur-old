/* Action Class executes data based on given command
*  @param command : string
*/
class Action {
  constructor(command) {
    this.command = command;
  }
}

/* Command Class parses raw text message into action specific data
*  @param rawText : string
*  @param validCmds : array
*/
class Command {
  constructor(rawData, validCmds) {
    this.rawData = rawData;
    this.validCmds = validCmds;
    this.cmd = null;
  }

  valid() {
    return this.validCmds.any(
      validCmd => this.cmd.toLowerCase() === validCmd
    );
  }
}

module.exports = { Action, Command };
