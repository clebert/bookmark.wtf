import {gql} from '@urql/core';

export const GET_GIST = gql`
  query GetGist($gistName: String!) {
    viewer {
      id
      gist(name: $gistName) {
        id
        name
        description
        owner {
          login
        }
        files(limit: 300) {
          name
          text
          isTruncated
        }
      }
    }
  }
`;
