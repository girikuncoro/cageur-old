const TwoArgCommand = require('./base-action');

const validCmds = [
  'broadcast', // en
  'kirim',      // id
];

class BroadcastCommand extends TwoArgCommand {
  constructor(sms) {
    super(sms, validCmds);
    this.group = this.arg;
  }

  valid() {
    return super.valid() && this.message.length > 0;
  }
}

module.exports = BroadcastCommand;
