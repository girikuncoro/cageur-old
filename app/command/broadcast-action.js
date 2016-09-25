const TwoArgCommand = require('./base-action');

const validCmds = [
  'broadcast', // en
  'kirim',     // id
];

const toAll = [
  'all',  // en
  'semua',     // id
];

const all = toAll[0];

const validGroups = [
  'hipertensi',
  'ginjal',
  'diabetes',
  'ispa',
];

class BroadcastCommand extends TwoArgCommand {
  constructor(sms) {
    super(sms, validCmds);
    this.group = null;

    if (toAll.includes(this.arg)) {
      this.group = all;
    } else if (validGroups.includes(this.arg)) {
      this.group = this.arg;
    }
  }

  valid() {
    return super.valid() && this.group && this.message.length > 0;
  }
}

module.exports = BroadcastCommand;
