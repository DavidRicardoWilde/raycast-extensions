interface SafeFetchOptions extends RequestInit {
  timeout?: number;
  responseType?: "json" | "text";
}

export async function safeFetch<T>(url: string, options: SafeFetchOptions = {}): Promise<T> {
  const { timeout = 10000, responseType = "json", ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (responseType === "text") {
      return (await response.text()) as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") throw new Error("Timeout Error: The request took too long to complete.");
      throw error;
    }
    throw new Error("Unknown error occurred during fetch");
  } finally {
    clearTimeout(id);
  }
}

export function decodeHTML(str: string): string {
  const entities: Record<string, string> = {
    "&quot;": '"',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&apos;": "'",
    "&nbsp;": " ",
    "&middot;": "·",
    "&ldquo;": "“",
    "&rdquo;": "”",
  };

  return str.replace(/&[a-z0-9#]+;/gi, (match) => {
    if (entities[match]) return entities[match];

    if (match.startsWith("&#")) {
      const code = parseInt(match.substring(match.startsWith("&#x") ? 3 : 2), match.startsWith("&#x") ? 16 : 10);
      return isNaN(code) ? match : String.fromCharCode(code);
    }

    return match;
  });
}
