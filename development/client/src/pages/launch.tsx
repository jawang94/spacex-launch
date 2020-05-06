import gql from "graphql-tag";
import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { RouteComponentProps } from "@reach/router";

import ActionButton from "../containers/action-button";
import { Header, LaunchDetail, Loading } from "../components";
import * as LaunchDetailsTypes from "./__generated__/LaunchDetails";
import { LAUNCH_TILE_DATA } from "./launches";

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchProps extends RouteComponentProps {
  // should be string though what is this...'any' smh
  launchId?: any;
}

const Launch: React.FC<LaunchProps> = ({ launchId }) => {
  const { data, loading, error } = useQuery<
    LaunchDetailsTypes.LaunchDetails,
    LaunchDetailsTypes.LaunchDetailsVariables
  >(GET_LAUNCH_DETAILS, {
    variables: { launchId },
  });

  if (loading) return <Loading />;
  if (error) return <p>Error: error.message</p>;
  if (!data) return <p>No Data</p>;

  return (
    <>
      <Header
        image={
          data.launch && data.launch.mission && data.launch.mission.missionPatch
        }
      >
        {data && data.launch && data.launch.mission && data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </>
  );
};

export default Launch;
