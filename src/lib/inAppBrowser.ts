const IN_APP_BROWSER_PATTERN =
  /tiktok|musical[_\s-]?ly|bytedance|instagram|\bfbav\b|\bfban\b|facebook/i;

export function isKnownInAppBrowser(userAgent: string): boolean {
  return IN_APP_BROWSER_PATTERN.test(userAgent);
}

export function shouldShowYouTubeGuide({
  hostname,
  search,
  userAgent,
}: {
  hostname: string;
  search: string;
  userAgent: string;
}): boolean {
  const params = new URLSearchParams(search);

  if (params.get("preview") === "1") return true;
  if (["localhost", "127.0.0.1", "::1"].includes(hostname)) return true;

  return isKnownInAppBrowser(userAgent);
}
