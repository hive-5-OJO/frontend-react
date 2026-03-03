import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Card } from '@/shared/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <Card className="max-w-md p-8 text-center">
            <div className="mb-4 flex justify-center">
              <svg
                className="h-16 w-16 text-error-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              문제가 발생했습니다
            </h2>
            <p className="mb-6 text-gray-600">
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 홈으로
              돌아가주세요.
            </p>
            {this.state.error && (
              <details className="mb-6 rounded-lg bg-gray-100 p-4 text-left">
                <summary className="cursor-pointer font-medium text-gray-700">
                  오류 상세 정보
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-600">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.reload()}
              >
                새로고침
              </Button>
              <Button variant="primary" fullWidth onClick={this.handleReset}>
                홈으로 이동
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
