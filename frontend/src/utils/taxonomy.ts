/**
 * Human-readable copy for the intent taxonomy and escalation policy
 * rules defined in the backend. Keys must match the backend's raw
 * string values exactly — this file only adds presentation, it does
 * not define new categories.
 */

export const INTENT_DESCRIPTIONS: Record<string, string> = {
  ACCOUNT_ACCESS_SECURITY: "Trouble signing in or a possible account security concern.",
  PAYMENT_BILLING: "A charge, billing amount, or payment method question.",
  RETURN_REPLACEMENT_REFUND: "A return, replacement, or refund request.",
  DELIVERY_DELAY: "A package that hasn't arrived by its expected date.",
  DELIVERY_MISSING_OR_MISDELIVERED: "Package reported as delivered but not received, or left at the wrong place.",
  DELIVERY_ATTEMPT_OR_INSTRUCTIONS: "A question about a delivery attempt or how to give delivery instructions.",
  ORDER_STATUS_OR_CANCELLATION: "A question about where an order stands, or a request to cancel it.",
  PRODUCT_PROBLEM: "The product itself arrived damaged, defective, or not as described.",
  PRIME_MEMBERSHIP: "A question about Prime membership, billing, or benefits.",
  GIFT_CARD_PROMOTION: "A gift card or promotional-code issue.",
  PRODUCT_AVAILABILITY_INFORMATION: "A question about whether a product is in stock or available.",
  DIGITAL_CONTENT: "An issue with a digital purchase — app, ebook, video, or similar.",
  DEVICE_TECHNICAL_SUPPORT: "A technical problem with a device.",
  WEBSITE_APP_TECHNICAL: "A technical problem with the website or app itself.",
  OTHER_NON_SUPPORT: "Message doesn't map cleanly to a known support intent.",
};

export function describeIntent(intent: string): string {
  return (
    INTENT_DESCRIPTIONS[intent] ??
    "No description available for this intent in the taxonomy."
  );
}

export function formatIntentLabel(intent: string): string {
  return intent
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export const DECISION_RULE_DESCRIPTIONS: Record<string, string> = {
  HIGH_RISK_ACCOUNT_SECURITY:
    "Account or security issues always route to a human, regardless of retrieval strength.",
  LOW_RETRIEVAL_CONFIDENCE:
    "The historical evidence retrieved for this query scored below the confidence threshold the policy requires.",
  PAYMENT_INVESTIGATION:
    "Payment and billing issues are treated as needing account- or transaction-specific investigation.",
  RETURN_REFUND_INSUFFICIENT_EVIDENCE:
    "The retrieved historical case didn't contain a clear return, replacement, or refund resolution.",
  UNRESOLVED_OR_REPEATED:
    "The customer's own wording signals a repeated or still-unresolved problem.",
  NON_SUPPORT_OR_AMBIGUOUS:
    "The message's intent wasn't identifiable with enough confidence for automated handling.",
  ACTIONABLE_WITH_EVIDENCE:
    "The intent is one the policy allows to auto-handle, and retrieval evidence met the confidence bar.",
  DEFAULT_ESCALATION:
    "No explicit auto-handling rule matched, so the policy defaults to a human review.",
};

export function describeDecisionRule(rule: string): string {
  return (
    DECISION_RULE_DESCRIPTIONS[rule] ??
    "This policy rule isn't in the documented rule set yet."
  );
}
