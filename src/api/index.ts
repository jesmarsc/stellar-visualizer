export const api = Object.freeze({
  HORIZON: "https://horizon.stellar.org",
  STELLAR_BEAT: " https://api.stellarbeat.io/v1",
});

export async function handleResponse(response: Response) {
  const { headers, ok } = response;
  const contentType = headers.get("content-type");

  const content = contentType
    ? contentType.includes("json")
      ? response.json()
      : response.text()
    : {
        status: response.status,
        message: response.statusText,
      };

  if (ok) return content;
  else throw await content;
}
