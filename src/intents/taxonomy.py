from .labels import INTENTS


INTENT_DEFINITIONS = {
    "DELIVERY_DELAY":
        "Late or delayed shipment or missed promised delivery window.",

    "DELIVERY_MISSING_OR_MISDELIVERED":
        "Delivered but not received, or delivered to the wrong location.",

    "DELIVERY_ATTEMPT_OR_INSTRUCTIONS":
        "False delivery attempt, driver behavior, delivery instructions, slot or location.",

    "ORDER_STATUS_OR_CANCELLATION":
        "Order lifecycle status, cancellation, dispatch or preorder questions.",

    "RETURN_REPLACEMENT_REFUND":
        "Return, replacement or refund process or status.",

    "PRODUCT_PROBLEM":
        "Damaged, defective, wrong, incomplete, used or counterfeit product.",

    "PAYMENT_BILLING":
        "Payment, card, charge, billing or Amazon Pay issues.",

    "PRIME_MEMBERSHIP":
        "Prime signup, renewal, cancellation or benefits.",

    "ACCOUNT_ACCESS_SECURITY":
        "Login, password, locked, hacked, 2FA or account security.",

    "GIFT_CARD_PROMOTION":
        "Gift cards, coupons, promotions or cashback.",

    "PRODUCT_AVAILABILITY_INFORMATION":
        "Stock, price, availability, shipping eligibility or product information.",

    "DIGITAL_CONTENT":
        "Prime Video, Amazon Music, Kindle or other digital content.",

    "DEVICE_TECHNICAL_SUPPORT":
        "Kindle, Fire TV, Fire Stick, Echo, Alexa or device technical support.",

    "WEBSITE_APP_TECHNICAL":
        "Amazon website, app, checkout, form or UI technical problems.",

    "OTHER_NON_SUPPORT":
        "Praise, general complaint without identifiable issue, marketing, social, unrelated or insufficient information.",
}


if list(INTENT_DEFINITIONS.keys()) != INTENTS:
    raise RuntimeError("Intent taxonomy does not match the locked 15-intent taxonomy.")