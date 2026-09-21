# Decision Log

## Decision 1 — Project architecture

**Decision:** Build the system as separate components for data processing, intent classification, retrieval, generation, escalation, and evaluation.

**Why:** The assignment evaluates multiple independent capabilities. Separating them allows each component to be tested independently and makes failure analysis possible.

**Status:** Active

---

## Decision 2 — Brand selection

**Decision:** Select `AmazonHelp` as the target brand.

**Why:** AmazonHelp provides the largest candidate conversation pool among the screened brands, with 82,246 conversations in the validated brand-selection analysis. It also has substantial multi-turn conversation depth, making it suitable for historical resolution retrieval and response generation.

**Evidence:** AmazonHelp had a mean conversation size of approximately 4.52 tweets, with 61.95% of conversations containing at least 3 tweets and 47.96% containing at least 4 tweets.

**Status:** Active

---

## Decision 3 — Conversation reconstruction

**Decision:** Reconstruct conversations using the dataset's explicit `in_response_to_tweet_id` parent pointers, rather than relying on tweet IDs or row order.

**Why:** Tweet IDs are not chronological conversation identifiers. Explicit parent references provide the correct relationship between replies and their preceding tweets.

**Evidence:** The reconstruction produced 798,197 unique conversation IDs. Among tweets containing parent references, 99.81% pointed to valid parent tweets.

**Status:** Active

---

## Decision 4 — Resolution evidence definition

**Decision:** Use a resolution taxonomy instead of a simple keyword-based rule for identifying useful support responses.

**Why:** Initial keyword-based screening produced false positives and false negatives. Resolution quality depends on whether a response actually diagnoses the issue, provides actionable guidance, performs a case action, or confirms an outcome.

**Resolution categories:** `NON_SUPPORT`, `ROUTING_ONLY`, `DIAGNOSTIC`, `ACTIONABLE_GUIDANCE`, `CASE_ACTION`, `CONFIRMED_OUTCOME`, `UNRESOLVED`, `AMBIGUOUS`.

**Status:** Active

---

## Decision 5 — Intent taxonomy

**Decision:** Use a 15-intent taxonomy for AmazonHelp.

**Intents:**
1. `DELIVERY_DELAY`
2. `DELIVERY_MISSING_OR_MISDELIVERED`
3. `DELIVERY_ATTEMPT_OR_INSTRUCTIONS`
4. `ORDER_STATUS_OR_CANCELLATION`
5. `RETURN_REPLACEMENT_REFUND`
6. `PRODUCT_PROBLEM`
7. `PAYMENT_BILLING`
8. `PRIME_MEMBERSHIP`
9. `ACCOUNT_ACCESS_SECURITY`
10. `GIFT_CARD_PROMOTION`
11. `PRODUCT_AVAILABILITY_INFORMATION`
12. `DIGITAL_CONTENT`
13. `DEVICE_TECHNICAL_SUPPORT`
14. `WEBSITE_APP_TECHNICAL`
15. `OTHER_NON_SUPPORT`

**Why:** The taxonomy provides actionable categories for intent classification, retrieval analysis, and escalation policy decisions while keeping the label set manageable for a small manually labelled training set.

**Status:** Active

---

## Decision 6 — Intent training set

**Decision:** Create a 300-example manually labelled AmazonHelp training set, stratified across conversation-size buckets.

**Why:** The assignment requires a manually labelled evaluation set and the project needs labelled examples for training and benchmarking the intent classifier. The training batch contains 75 examples from each of four conversation-size buckets.

**Split:** 225 training examples and 75 validation examples, using a stratified split with `random_state=42`.

**Status:** Active

---

## Decision 7 — Intent model selection

**Decision:** Use SentenceTransformer embeddings with Logistic Regression as the serving intent classifier.

**Why:** Among the tested baselines, the SentenceTransformer + Logistic Regression model achieved the highest validation macro F1.

**Validation result:** Accuracy = 0.2000; Macro F1 = 0.1865.

**Comparison:** Majority, TF-IDF + Logistic Regression, customer-only TF-IDF, word+character TF-IDF + LinearSVC, and SentenceTransformer + Logistic Regression were compared on the same 225/75 validation split.

**Caveat:** The benchmark is small and has limited examples per class, so the result should be treated as an internal development benchmark rather than a production-quality accuracy estimate.

**Status:** Active

---

## Decision 8 — Retrieval corpus and leakage control

**Decision:** Build the retrieval corpus from AmazonHelp historical resolution episodes while excluding the benchmark conversations used for intent training and taxonomy auditing.

**Why:** Retrieval evaluation must not retrieve the exact benchmark conversations being evaluated.

**Evidence:** The leakage-safe serving corpus contains 81,796 AmazonHelp resolution episodes after excluding 450 benchmark conversations.

**Status:** Active

---

## Decision 9 — Retrieval method

**Decision:** Use SentenceTransformer embeddings with FAISS similarity search for historical resolution retrieval.

**Why:** Semantic embeddings allow the system to retrieve historically similar support conversations even when wording differs. FAISS provides efficient vector similarity search.

**Embedding dimension:** 384.

**Retrieval benchmark:** On 150 manually judged queries, Hit@1 = 0.64 and Hit@3 = 0.82.

**Status:** Active

---

## Decision 10 — Escalation policy

**Decision:** Keep escalation as an explicit deterministic policy layer rather than allowing the response-generation model to decide escalation independently.

**Why:** Escalation is a safety and control decision. Making it explicit makes the policy auditable and prevents the generator from silently changing the handling decision.

**Key rules:** Account-security issues are escalated; low retrieval confidence is escalated; payment investigations are escalated; insufficient return/refund evidence is escalated; unresolved/repeated issues are escalated; non-support or ambiguous requests are escalated.

**Status:** Active

---

## Decision 11 — Response generation

**Decision:** Use Groq-hosted `openai/gpt-oss-20b` for response generation with historical evidence, predicted intent, and the explicit escalation decision supplied to the prompt.

**Why:** The response generator should draft an evidence-grounded support reply rather than independently determining the policy decision.

**Generation constraints:** The prompt explicitly prohibits inventing refunds, replacements, dates, account actions, internal actions, or other operational claims that are not supported by the historical evidence.

**Status:** Active

---

## Decision 12 — Grounding safety layer

**Decision:** Add a post-generation grounding check and safe fallback response.

**Why:** A generated response can make unsupported operational claims even when the prompt instructs it not to. Detecting common action-claim patterns provides an additional safety layer.

**Behavior:** If a grounding violation is detected, the system records the grounding flag and replaces the generated response with an intent-specific safe fallback.

**Status:** Active

---

## Decision 13 — LLM-as-judge evaluation

**Decision:** Evaluate generated responses using a structured six-dimension LLM judge.

**Dimensions:** Correctness, relevance, grounding, helpfulness, tone, and completeness.

**Benchmark:** 150 generated responses.

**Result:** Mean score = 1.724 / 2.00 (86.2% of the maximum possible score).

**Caveat:** The generator and judge use the same model family, so this evaluation can contain self-evaluation bias. The score is a controlled benchmark result, not a real-world customer-resolution rate.

**Status:** Active

---

## Decision 14 — Failure analysis

**Decision:** Track explicit response failure modes rather than reporting only an aggregate score.

**Failure modes:** `INCOMPLETE_RESPONSE`, `FABRICATED_DETAIL`, `MISSED_ESCALATION`, `UNSUPPORTED_ACTION`, `UNNECESSARY_ESCALATION`, `IRRELEVANT_RESPONSE`, and `WRONG_INTENT`.

**Why:** Aggregate quality scores can hide operationally important failures. Explicit failure categories make the system's weaknesses actionable for future improvements.

**Status:** Active

---

## Decision 15 — Reproducibility

**Decision:** Keep the project reproducible through pinned dependencies, configuration files, scripts, tests, and saved benchmark artifacts.

**Why:** The assignment requires a runnable repository capable of reproducing the headline results within the available evaluation workflow.

**Validation:** The project test suite currently passes with 7 tests.

**Status:** Active

---

## Decision 16 — Human agreement reporting

**Decision:** Do not claim human agreement or Cohen's kappa until actual independent human ratings are available and verified.

**Why:** Model-generated ratings are not evidence of human agreement. Reporting them as human validation would overstate the strength of the evaluation.

**Status:** Pending human annotation
