import gql from "graphql-tag";
import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { RouteComponentProps } from "@reach/router";

import { Header, LaunchTile, Loading } from "../components";
import * as GetMyTripsTypes from "./__generated__/GetMyTrips";
import { LAUNCH_TILE_DATA } from "./launches";

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface ProfileProps extends RouteComponentProps {}

const Profile: React.FC<ProfileProps> = () => {
  const { data, loading, error } = useQuery<GetMyTripsTypes.GetMyTrips, any>(
    GET_MY_TRIPS,
    { fetchPolicy: "network-only" }
  );
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (data === undefined) return <p>No Data</p>;

  return (
    <>
      <Header>My Trips</Header>
      {data.me && data.me.trips.length ? (
        data.me.trips.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))
      ) : (
        <p>You haven't booked any trips</p>
      )}
    </>
  );
};

export default Profile;
