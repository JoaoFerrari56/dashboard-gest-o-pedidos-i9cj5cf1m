import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  private handleReset = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/auth'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border border-slate-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="h-10 w-10 text-brand-red" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Ops! Algo deu errado
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Encontramos um erro inesperado no sistema. Isso pode ter
                ocorrido por uma falha de conexão ou sessão expirada.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-50 p-4 rounded-xl text-left overflow-auto max-h-32 text-[11px] text-slate-600 font-mono border border-slate-100 shadow-inner">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center h-12 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Recarregar Página
              </button>
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center h-12 bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-bold rounded-xl transition-all active:scale-[0.98]"
              >
                <LogOut className="mr-2 h-4 w-4 text-slate-400" /> Sair e Limpar
                Dados
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
