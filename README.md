# Hiver SDE Intern — AI Customer Support Agent

A historically grounded AI customer-support agent built from the **Customer Support on Twitter (TWCS)** dataset.

The system is designed to:

1. Classify an incoming customer query into a support intent.
2. Retrieve historically similar support conversations.
3. Use historical evidence to draft a grounded response.
4. Make an explicit `AUTO_HANDLE` or `ESCALATE` decision through a deterministic policy layer.
5. Apply a post-generation grounding check to prevent unsupported operational claims.
6. Evaluate intent classification, retrieval, escalation, and generated responses separately.

---

## 1. Problem

Customer-support automation needs to do more than generate fluent text.

A useful support agent should:

- understand the customer's intent,
- find evidence from previously resolved cases,
- avoid inventing actions or policies,
- distinguish requests that can be safely handled automatically from those requiring human support,
- and expose measurable failure modes.

This project implements that workflow using historical Twitter customer-support conversations.

The selected brand is **AmazonHelp**.

---

## 2. Dataset

### Customer Support on Twitter

Source:

`thoughtvector/customer-support-on-twitter`

The dataset contains Twitter customer-support conversations with:

- `tweet_id`
- `author_id`
- `inbound`
- `created_at`
- `text`
- `response_tweet_id`
- `in_response_to_tweet_id`

The project treats the available TWCS files as **one public dataset**, not as separate datasets.

### Dataset Reconnaissance

The validated TWCS source contains:

| Metric | Value |
|---|---:|
| Tweets | 2,811,774 |
| Reconstructed conversations | 798,197 |
| Customer/inbound tweets | 1,537,843 |
| Company/outbound tweets | 1,273,931 |

The conversation graph was reconstructed using `in_response_to_tweet_id`.

Among tweets containing a parent reference, **99.81%** pointed to a valid parent tweet.

---

## 3. Conversation Reconstruction

Tweet IDs were not used as chronological conversation identifiers.

Instead, each tweet was connected to its parent using:

```text
in_response_to_tweet_id