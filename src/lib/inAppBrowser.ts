const IN_APP_BROWSER_PATTERN =
  /tiktok|musical[_\s.-]?ly|bytedance|ttwebview|trill|aweme|zhiliaoapp|instagram|\bfbav\b|\bfban\b|facebook/i;

const ANDROID_WEBVIEW_PATTERN = /;\s*wv\)|\bversion\/4\.0\b.*\bchrome\//i;
const IOS_DEVICE_PATTERN = /iphone|ipad|ipod|macintosh.*mobile/i;
const IOS_WEBKIT_PATTERN = /applewebkit/i;
const IOS_MOBILE_PATTERN = /mobile\//i;
const IOS_STANDALONE_BROWSER_PATTERN =
  /safari\/|crios\/|fxios\/|edgios\/|opios\/|duckduckgo\//i;
const IN_APP_REFERRER_PATTERN =
  /(^|\.)tiktok\.com$|(^|\.)tiktokv\.com$|(^|\.)musical\.ly$|(^|\.)instagram\.com$|(^|\.)facebook\.com$/i;

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

function hasKnownInAppReferrer(referrer: string): boolean {
  if (!referrer) return false;

  try {
    return IN_APP_REFERRER_PATTERN.test(new URL(referrer).hostname);
  } catch {
    return false;
  }
}

export function shouldShowYouTubeGuide({
  hostname,
  search,
  userAgent,
  referrer = "",
}: {
  hostname: string;
  search: string;
  userAgent: string;
  referrer?: string;
}): boolean {
  const params = new URLSearchParams(search);

  if (params.get("preview") === "1") return true;
  if (["localhost", "127.0.0.1", "::1"].includes(hostname)) return true;

  return isKnownInAppBrowser(userAgent) || hasKnownInAppReferrer(referrer);
}
