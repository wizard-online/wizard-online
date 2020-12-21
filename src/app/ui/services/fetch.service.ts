function baseFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const defaultOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${process.env.API_URL}${url}`, {
    ...defaultOptions,
    ...options,
  }).then((response) => {
    if (response.status !== 200)
      throw new Error(`HTTP status ${response.status}`);
    return response;
  });
}

export function get(url: string): Promise<Response> {
  return baseFetch(url, { method: "GET" });
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function post<T extends object>(
  url: string,
  body: T
): Promise<Response> {
  return baseFetch(url, { method: "POST", body: JSON.stringify(body) });
}
