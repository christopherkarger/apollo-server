const Event = require("../../models/event");
const { user } = require("./merge");

module.exports = {
  Query: {
    events: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      try {
        const events = await Event.find();
        return events.map((event) => {
          return {
            ...event._doc,
            creator: () => user(event._doc.creator),
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createEvent: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5f17edd3d7770865ebc5644c",
      });
      try {
        const savedEvent = await event.save();
        const createdEvent = {
          ...savedEvent._doc,
          creator: user.bind(this, savedEvent._doc.creator),
        };

        const userById = await User.findById("5f17edd3d7770865ebc5644c");
        if (!userById) {
          throw new Error("User does not exits");
        }

        userById.createdEvents.push(event);
        await userById.save();
        return createdEvent;
      } catch (err) {
        throw err;
      }
    },
  },
};
