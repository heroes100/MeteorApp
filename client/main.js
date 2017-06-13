import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { check } from 'meteor/check';

import { Messages } from '../imports/api/messages.js';
import '../imports/startup/accounts-config.js';
import './main.html';


Template.main.onCreated(function bodyOnCreated() {
  Meteor.subscribe('messages');
});

Template.main.helpers({

  isOwner() {
    return this.owner === Meteor.userId();
  },

  messages() {
    return Messages.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
  },

});

Template.main.events({

  'submit .new-message'(event) {

    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('messages.insert', text);

    // Clear form
    target.text.value = '';
  },

  'click .delete'() {
    check(this._id, String);
    const message = Messages.findOne(this._id);

    if (message.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Messages.remove(this._id);
  },

});
