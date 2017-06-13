import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Messages } from './messages.js';

if (Meteor.isServer) {
  describe('Messages', () => {
    describe('methods', () => {
      const userId = Random.id();
      let messageId;

      beforeEach(() => {
        Messages.remove({});
        messageId = Messages.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
      });

      //Test deleting own message
      it('Can delete owned message', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteMessage = Meteor.server.method_handlers['messages.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteMessage.apply(invocation, [messageId]);

        // Verify that the method does what we expected
        assert.equal(Messages.find().count(), 0);
      });

      //Test deleting another users message
      it('Can\'t delete another users message', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteMessage = Meteor.server.method_handlers['messages.remove'];

        // Run the method with `this` set to the fake invocation
        deleteMessage.apply(null, [messageId]);

        // Verify that the method does what we expected
        assert.equal(Messages.find().count(), 0);
      });

    });
  });
}



if (! Meteor.isServer) {
  describe('Messages', () => {
    describe('methods', () => {
      Meteor.userId = Random.id();

      let messageId;

      //Test adding a message as a user
      it('Can insert new message as valid user', () => {
        Meteor.userId = Random.id();

        // Run the method with `this` set to the fake invocation
        Meteor.call('messages.insert', 'Test text.');

        // Verify that the method does what we expected
        assert.equal(Messages.find().count(), 1);
      });

      //Test adding a message as an invalid user
      it('Can\'t insert new message as invalid user', () => {
        Meteor.userId = null;

        Meteor.call('messages.insert', 'Test text.');

        // Verify that the method does what we expected
        assert.equal(Messages.find().count(), 0);
      });

    });
  });
}
