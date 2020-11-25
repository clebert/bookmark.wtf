/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_viewer {
  __typename: "User";
  id: string;
  /**
   * The username used to login.
   */
  login: string;
}

export interface GetUser {
  /**
   * The currently authenticated user.
   */
  viewer: GetUser_viewer;
}
