const Event = require("../../models/event");
const User = require("../../models/user");

const DataLoader = require("dataloader");

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const eventLoader = new DataLoader((eventIds) => {
  return Event.find({ _id: { $in: eventIds } });
});

const events = async (eventIds) => {
  const events = await eventLoader.load(eventIds);
  try {
    return events.map((event) => {
      return {
        ...event._doc,
        creator: () => user(event.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return {
      ...event._doc,
      creator: () => user(event.creator),
    };
  } catch (err) {
    throw err;
  }
};

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
