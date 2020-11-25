import {gql} from '@apollo/client/core';

export const GET_GISTS = gql`
  query GetGists {
    viewer {
      id
      gists(
        privacy: ALL
        last: 100
        orderBy: {field: UPDATED_AT, direction: DESC}
      ) {
        nodes {
          id
          name
          description
        }
      }
    }
  }
`;
