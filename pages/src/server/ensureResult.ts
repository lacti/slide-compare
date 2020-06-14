export async function ensureJSONResult<T>(r: Response) {
  const json = await r.json();
  if ("error" in json) {
    throw new Error(json.error);
  }
  return json as T;
}

export async function ensureTextResult(r: Response) {
  const text = await r.text();
  try {
    const maybeJSON = JSON.parse(text);
    if ("error" in maybeJSON) {
      throw new Error(maybeJSON.error);
    }
  } catch (ignored) {}
  return text;
}
