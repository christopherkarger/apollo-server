const userResolver = require("./user");
const bookingsResolver = require("./bookings");
const eventsResolver = require("./events");

module.exports = {
  Query: {
    ...userResolver.Query,
    ...bookingsResolver.Query,
    ...eventsResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...bookingsResolver.Mutation,
    ...eventsResolver.Mutation,
  },
};
