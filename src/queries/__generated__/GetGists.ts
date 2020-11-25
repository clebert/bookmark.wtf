/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGists
// ====================================================

export interface GetGists_viewer_gists_nodes {
  __typename: "Gist";
  id: string;
  /**
   * The gist name.
   */
  name: string;
  /**
   * The gist description.
   */
  description: string | null;
}

export interface GetGists_viewer_gists {
  __typename: "GistConnection";
  /**
   * A list of nodes.
   */
  nodes: (GetGists_viewer_gists_nodes | null)[] | null;
}

export interface GetGists_viewer {
  __typename: "User";
  id: string;
  /**
   * A list of the Gists the user has created.
   */
  gists: GetGists_viewer_gists;
}

export interface GetGists {
  /**
   * The currently authenticated user.
   */
  viewer: GetGists_viewer;
}
