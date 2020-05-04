const { paginateResults } = require('./utils');

module.exports = {
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
};
