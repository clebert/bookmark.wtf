import {gql} from '@urql/core';

export const GET_USER = gql`
  query GetUser {
    viewer {
      id
      login
    }
  }
`;
