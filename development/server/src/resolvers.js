const { paginateResults } = require('./utils');

module.exports = {
  Mission: {
    // default size is 'large' in case user doesn't specify
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL' ? mission.missionPatchSmall : mission.missionPatchLarge;
    },
  },

  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },

  User: {
    trips: async (_, __, { dataSources }) => {
      // get ids of launchers by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];

      // look up launches by their ids
      return dataSources.launchAPI.getLaunchesByIds({ launchIds }) || [];
    },
  },

  Query: {
    launches: async (_, { after, pageSize = 20 }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();

      // reverse chronological order
      allLaunches.reverse();
      launches = paginateResults({ after, pageSize, results: allLaunches });

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        hasMore:
          launches.length &&
          launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor,
      };
    },

    launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchById({ launchId: id }),

    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },

  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      // auth token is basically the user's email converted to raw memory allocation (binary)
      // which is then encoded in base64 to an ascii string for display. Waaaay simple lmao
      if (user) return Buffer.from(email).toString('base64');
    },

    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({ launchIds });

      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? 'trips booked successfully'
            : `the following launches couldn't be booked: ${launchIds.filter(
                (id) => !results.includes(id),
              )}`,
        launches,
      };
    },

    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });

      if (!result) {
        return {
          success: false,
          message: 'failed to cancel trip',
        };
      }

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });

      return {
        success: true,
        message: 'trip cancelled',
        launches: [launch],
      };
    },
  },
};
