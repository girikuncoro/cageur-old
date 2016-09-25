const TwoArgCommand = require('./base-action');
const Action = require('./base').Action;
const User = require('../model/user');
const nexmo = require('../config/sms').nexmo;
const nexmoPhone = require('../config/sms').nexmoPhone;

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

class BroadcastAction extends Action {
  constructor(command) {
    super(command);
    this.clinic = null;
  }

  execute() {
    User.findById(this.command.sms.user)
    .then((user) => {
      this.message = this.command.message;
      this.clinic = user.clinic;

      if (this.group === all) {
        return User.find({ clinic: this.clinic, userRoles: 'patient' });
      }
      return User.find({ clinic: this.clinic, userRoles: 'patient', diseases: this.group });
    })
    .then((patients) => {
      if (patients.length === 0) {
        return 'Message delivery failed';
      }
      patients.forEach((patient) => {
        // TODO: use task queue from Heroku
        nexmo.message.sendSms(
          nexmoPhone.US, patient.phoneNumber, this.message, (_, __) => { }
        );
      });
      return 'Message delivered';
    });
  }
}


module.exports = { BroadcastCommand, BroadcastAction };
