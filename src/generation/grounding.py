import re


ACTION_CLAIM_PATTERNS = [

    # Claims that the agent already performed an operational action.
    r"i(?:'ve| have) "
    r"(?:forwarded|escalated|submitted|logged|investigated)",

    r"we(?:'ve| have) "
    r"(?:forwarded|escalated|submitted|logged|investigated)",

    # Claims that the agent will perform an operational action.
    r"i(?:['’]ll| will) "
    r"(?:forward|escalate|submit|log|investigate)",

    r"we(?:['’]ll| will) "
    r"(?:forward|escalate|submit|log|investigate)",

    r"i(?:'m|’m) "
    r"(?:forwarding|escalating|submitting|logging|investigating)",

    r"we(?:'re|’re) "
    r"(?:forwarding|escalating|submitting|logging|investigating)",

    # Passive operational-action claims.
    r"(?:has|have) been escalated",

    r"(?:has|have) been forwarded",

    # Claims that the agent can directly access or perform
    # account/order-specific operations.
    r"(?:i|we) can "
    r"(?:check|look up|access|view|verify|update|cancel|change)"
    r".{0,80}"
    r"(?:order|account|payment|refund|shipment|delivery)",

    r"(?:i|we) will "
    r"(?:check|look up|access|view|verify|update|cancel|change)"
    r".{0,80}"
    r"(?:order|account|payment|refund|shipment|delivery)",

    # Direct claims of system access.
    r"(?:i|we) have access to "
    r"(?:your|the)"
    r".{0,80}"
    r"(?:order|account|payment|shipment|delivery)",

    # Claims that an order/account was directly checked.
    r"(?:i|we) (?:checked|looked up|verified|reviewed)"
    r".{0,80}"
    r"(?:order|account|payment|shipment|delivery)",
]


def detect_unsupported_action_claims(
    response,
):

    response = response.lower()

    flags = []

    for pattern in ACTION_CLAIM_PATTERNS:

        if re.search(
            pattern,
            response,
        ):

            flags.append(pattern)

    return flags
