export interface GithubAPIRequest {
  readonly method: 'POST' | 'PATCH' | 'DELETE';
  readonly pathname: string;
  readonly params: object;
  readonly token: string;
}

export interface GithubAPIResponse {
  readonly data?: unknown;
  readonly eTag?: string;
}

export async function fetchGithubApi(request: GithubAPIRequest): Promise<GithubAPIResponse> {
  const {method, pathname, params, token} = request;

  const response = await fetch(`https://api.github.com${pathname}`, {
    method,
    headers: {
      'Accept': `application/vnd.github.v3+json`,
      'Content-Type': `application/json`,
      'Authorization': `token ${token}`,
    },
    body: JSON.stringify(params),
    keepalive: true,
  });

  if (response.status === 204) {
    return {};
  }

  if (response.status === 500) {
    throw new Error(`Failed to fetch GitHub API: ${response.statusText || response.status}`);
  }

  const body = await response.json();

  if (response.status === 200 || response.status === 201) {
    return {data: body, eTag: response.headers.get(`etag`) ?? undefined};
  }

  throw new Error(
    `Failed to fetch GitHub API: ${body.message || response.statusText || response.status}`,
  );
}
