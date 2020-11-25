/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetGist
// ====================================================

export interface GetGist_viewer_gist_owner {
  __typename: "Organization" | "User";
  /**
   * The username used to login.
   */
  login: string;
}

export interface GetGist_viewer_gist_files {
  __typename: "GistFile";
  /**
   * The gist file name.
   */
  name: string | null;
  /**
   * UTF8 text data or null if the file is binary
   */
  text: string | null;
  /**
   * Whether the file's contents were truncated.
   */
  isTruncated: boolean;
}

export interface GetGist_viewer_gist {
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
  /**
   * The gist owner.
   */
  owner: GetGist_viewer_gist_owner | null;
  /**
   * The files in this gist.
   */
  files: (GetGist_viewer_gist_files | null)[] | null;
}

export interface GetGist_viewer {
  __typename: "User";
  id: string;
  /**
   * Find gist by repo name.
   */
  gist: GetGist_viewer_gist | null;
}

export interface GetGist {
  /**
   * The currently authenticated user.
   */
  viewer: GetGist_viewer;
}

export interface GetGistVariables {
  gistName: string;
}
