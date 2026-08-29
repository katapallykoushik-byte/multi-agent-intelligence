/**
 * Centralized, responsive metric formatting utilities.
 * Prevents UI layout overflow while preserving exact values for tooltips and details.
 */

export type MetricFormatType =
  | "currency"
  | "currencyExact"
  | "percentage"
  | "decimal"
  | "compact"
  | "integer";

export interface FormatMetricOptions {
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Format any numeric or metric value cleanly and responsively.
 */
export function formatMetricValue(
  value: number | string | null | undefined,
  type: MetricFormatType = "compact",
  options?: FormatMetricOptions
): string {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) {
    return String(value);
  }

  const decimals = options?.decimals;

  switch (type) {
    case "currency": {
      const absVal = Math.abs(num);
      const sign = num < 0 ? "-" : "";

      if (absVal >= 1_000_000_000) {
        return `${sign}$${(absVal / 1_000_000_000).toFixed(decimals ?? 1)}B`;
      }
      if (absVal >= 1_000_000) {
        return `${sign}$${(absVal / 1_000_000).toFixed(decimals ?? 1)}M`;
      }
      if (absVal >= 100_000) {
        return `${sign}$${(absVal / 1_000).toFixed(decimals ?? 0)}K`;
      }
      if (absVal >= 10_000) {
        return `${sign}$${(absVal / 1_000).toFixed(decimals ?? 1)}K`;
      }
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: decimals ?? 0,
        minimumFractionDigits: 0,
      }).format(num);
    }

    case "currencyExact": {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: decimals ?? 0,
        minimumFractionDigits: 0,
      }).format(num);
    }

    case "percentage": {
      return `${num.toFixed(decimals ?? 1)}%`;
    }

    case "decimal": {
      return num.toFixed(decimals ?? 3);
    }

    case "integer": {
      return Math.round(num).toLocaleString("en-US");
    }

    case "compact":
    default: {
      const absVal = Math.abs(num);
      const sign = num < 0 ? "-" : "";

      if (absVal >= 1_000_000_000) {
        return `${sign}${(absVal / 1_000_000_000).toFixed(decimals ?? 1)}B`;
      }
      if (absVal >= 1_000_000) {
        return `${sign}${(absVal / 1_000_000).toFixed(decimals ?? 1)}M`;
      }
      if (absVal >= 1_000) {
        return `${sign}${(absVal / 1_000).toFixed(decimals ?? 1)}K`;
      }
      return num.toLocaleString("en-US", {
        maximumFractionDigits: decimals ?? 2,
      });
    }
  }
}

/**
 * Return the exact full underlying value for hover tooltips or detail view.
 */
export function formatExactValue(
  value: number | string | null | undefined,
  type: MetricFormatType = "compact"
): string {
  if (value === null || value === undefined || value === "") {
    return "Not Available";
  }

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  if (type === "currency" || type === "currencyExact") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(num);
  }

  if (type === "percentage") {
    return `${num.toFixed(2)}%`;
  }

  return num.toLocaleString("en-US", { maximumFractionDigits: 4 });
}
