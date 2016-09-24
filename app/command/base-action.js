const Command = require('./base');

/* Two arguments command
*  format : <command> <arg0> <rest>
*  @param command : string
*/
class TwoArgCommand extends Command {
  constructor(sms, validCmds) {
    super(sms, validCmds);

    const words = sms.text.split(' ').filter(s => s.length > 0);
    this.sms = sms;
    this.arg = null;
    this.message = '';

    if (words.length >= 3) {
      this.cmd = words[0];
      this.arg = words[1];
      this.message = ' '.join(words.slice(2));
    }
  }
}

module.exports = TwoArgCommand;
