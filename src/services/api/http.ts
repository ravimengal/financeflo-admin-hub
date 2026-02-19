import { getRequestHeaders, buildApiUrl } from './config';

interface RequestOptions {
  orgId?: string;
  userId?: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
}

class HttpService {
  private defaultOrgId = '';
  private defaultUserId = '';

  setDefaultContext(orgId: string, userId: string) {
    this.defaultOrgId = orgId;
    this.defaultUserId = userId;
  }

  private getHeaders(options?: RequestOptions): Record<string, string> {
    const orgId = options?.orgId || this.defaultOrgId;
    const userId = options?.userId || this.defaultUserId;
    return {
      ...getRequestHeaders(orgId, userId),
      ...options?.headers,
    };
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = buildApiUrl(path);
    if (!params) return url;

    const filtered = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null
    );
    if (filtered.length === 0) return url;

    const query = new URLSearchParams(
      filtered.map(([k, v]) => [k, String(v)])
    ).toString();
    return `${url}?${query}`;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`
      );
    }
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  }

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'GET',
      headers: this.getHeaders(options),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'POST',
      headers: this.getHeaders(options),
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'PUT',
      headers: this.getHeaders(options),
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'PATCH',
      headers: this.getHeaders(options),
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(this.buildUrl(path, options?.params), {
      method: 'DELETE',
      headers: this.getHeaders(options),
    });
    return this.handleResponse<T>(response);
  }
}

export const httpService = new HttpService();
