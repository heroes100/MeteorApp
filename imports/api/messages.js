import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Messages = new Mongo.Collection('messages');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('messages', function tasksPublication() {
    return Messages.find();
  });

  Messages.allow({
    'remove': function (messageId) {
        return true;
      },
  });
}

Meteor.methods({

  'messages.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Messages.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

  },

  'messages.remove'(messageId) {
    check(messageId, String);
    Messages.remove(messageId);
  },

  'messages.setChecked'(messageId, setChecked) {
    check(messageId, String);
    check(setChecked, Boolean);
    Messages.update(messageId, { $set: { checked: setChecked } });
  },

  'messages.find'() {
    return Messages.find({}, { sort: { createdAt: -1 } });
  },

});
