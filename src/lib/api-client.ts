import { getToken } from "@/lib/auth";

type ApiOptions = RequestInit & {
  params?: Record<string, string | number | undefined>;
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | undefined>
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private getRequestHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (typeof window !== "undefined") {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    path: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);

    const headers = {
      ...this.getRequestHeaders(),
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        const { clearToken } = await import("@/lib/auth");
        const { useAuthStore } = await import("@/stores/auth-store");
        clearToken();
        useAuthStore.setState({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=1";
        }
      }

      const error = await response.json().catch(() => ({}));
      const detail = error.detail ?? error.message;
      const message = Array.isArray(detail)
        ? detail.map((d: Record<string, unknown>) => String(d.msg ?? d)).join("; ")
        : typeof detail === "string"
          ? detail
          : typeof detail === "object" && detail !== null
            ? JSON.stringify(detail)
            : "An error occurred";
      throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  get<T>(path: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  post<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }

  async uploadFile<T>(path: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const token = getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        const { clearToken } = await import("@/lib/auth");
        const { useAuthStore } = await import("@/stores/auth-store");
        clearToken();
        useAuthStore.setState({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=1";
        }
      }

      const error = await response.json().catch(() => ({}));
      const detail = error.detail ?? error.message;
      const message = Array.isArray(detail)
        ? detail.map((d: Record<string, unknown>) => String(d.msg ?? d)).join("; ")
        : typeof detail === "string"
          ? detail
          : typeof detail === "object" && detail !== null
            ? JSON.stringify(detail)
            : "An error occurred";
      throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const apiClient = new ApiClient();
