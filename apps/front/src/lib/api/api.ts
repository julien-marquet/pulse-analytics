export interface ApiConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  body: T;
  status: number;
  headers: Headers;
}

export interface ApiRequestOptions extends RequestInit {
  params?: URLSearchParams;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private config: Required<ApiConfig>;

  constructor(config: ApiConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '',
      defaultHeaders: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
      timeout: config.timeout || 10000,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    { params, ...options }: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params);
    const requestOptions = this.buildRequestOptions(options);

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        this.config.timeout,
      );

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let message = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const body = await response.json();
          if (body?.message) {
            message = Array.isArray(body.message)
              ? body.message.join(', ')
              : String(body.message);
          }
        } catch {
          // ignore parse errors, use default message
        }
        throw new ApiError(message, response.status, response);
      }

      // Parse JSON safely
      const data = await this.parseResponse<T>(response);

      return {
        body: data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw error;
    }
  }

  private buildUrl(endpoint: string, params?: URLSearchParams): string {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    if (params == undefined) {
      return url;
    }
    return `${url}?${params}`;
  }

  private buildRequestOptions(options: RequestInit): RequestInit {
    return {
      ...options,
      headers: {
        ...this.config.defaultHeaders,
        ...options.headers,
      },
    };
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        throw new ApiError('Invalid JSON response', response.status, response);
      }
    }

    // Handle text responses
    return (await response.text()) as unknown as T;
  }

  async get<T>(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}
