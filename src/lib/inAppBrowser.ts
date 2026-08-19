const IN_APP_BROWSER_PATTERN =
  /tiktok|musical[_\s.-]?ly|bytedance|ttwebview|trill|aweme|zhiliaoapp|instagram|\bfbav\b|\bfban\b|facebook/i;

const ANDROID_WEBVIEW_PATTERN = /;\s*wv\)|\bversion\/4\.0\b.*\bchrome\//i;
const IOS_DEVICE_PATTERN = /iphone|ipad|ipod|macintosh.*mobile/i;
const IOS_WEBKIT_PATTERN = /applewebkit/i;
const IOS_MOBILE_PATTERN = /mobile\//i;
const IOS_STANDALONE_BROWSER_PATTERN =
  /safari\/|crios\/|fxios\/|edgios\/|opios\/|duckduckgo\//i;
export function isKnownInAppBrowser(userAgent: string): boolean {
  const isIosWebView =
    IOS_DEVICE_PATTERN.test(userAgent) &&
    IOS_WEBKIT_PATTERN.test(userAgent) &&
    IOS_MOBILE_PATTERN.test(userAgent) &&
    !IOS_STANDALONE_BROWSER_PATTERN.test(userAgent);

  return (
    IN_APP_BROWSER_PATTERN.test(userAgent) ||
    ANDROID_WEBVIEW_PATTERN.test(userAgent) ||
    isIosWebView
  );
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

  // Do not use the referrer here. External browsers can preserve TikTok's
  // referrer during handoff, which would incorrectly show the guide again.
  return isKnownInAppBrowser(userAgent);
}
