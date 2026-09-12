import React from "react";
import { AlertCircle, CheckCircle2, RotateCw } from "lucide-react";

export default function AlertMessage({ type = "error", message, onRetry }) {
  if (!message) return null;

  const isError = type === "error";

  return (
    <div
      className={`p-4 rounded-xl border flex items-start justify-between space-x-3 my-4 ${
        isError
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-emerald-50 border-emerald-200 text-emerald-800"
      }`}
    >
      <div className="flex items-start space-x-3">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
        )}
        <div className="text-sm">
          <p className="font-medium">{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-1 text-xs font-semibold text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-md transition flex-shrink-0"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
