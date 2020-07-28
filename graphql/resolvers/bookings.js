const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { singleEvent } = require("./merge");
const { user } = require("./merge");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    bookings: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      try {
        const bookings = await Booking.find();
        return bookings.map((booking) => {
          return {
            ...booking._doc,
            user: () => user(booking._doc.user),
            event: () => singleEvent(booking._doc.event),
            createdAt: new Date(booking._doc.createdAt).toISOString(),
            updatedAt: new Date(booking._doc.updatedAt).toISOString(),
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    bookEvent: async (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication Failed");
      }
      try {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });

        const booking = new Booking({
          user: "5f17edd3d7770865ebc5644c",
          event: fetchedEvent,
        });

        const result = await booking.save();
        return {
          ...result._doc,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString(),
        };
      } catch (err) {
        throw err;
      }
    },
    cancelEvent: async (parent, args, context) => {
      try {
        const booking = await Booking.findById(args.eventId).populate("event");
        await Booking.deleteOne({ _id: args.bookingId });
        return {
          ...booking.event._doc,
          creator: user.bind(this, booking.event._doc.creator),
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
