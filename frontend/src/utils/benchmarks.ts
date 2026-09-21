/**
 * These are the project's own offline benchmark results — computed
 * once against held-out/hand-labelled sets, not values the backend
 * serves live. They're kept as constants (rather than fetched)
 * because that's what they are: fixed evaluation artifacts.
 */

export const CORPUS_STATS = {
  totalTweets: 2_811_774,
  reconstructedConversations: 798_197,
  amazonHelpConversations: 82_246,
  retrievalCorpus: 81_796,
};

export const INTENT_METRICS = {
  accuracy: 0.2000,
  macroF1: 0.1865,
  labeledExamples: 300,
  validationExamples: 75,
};

export const RETRIEVAL_METRICS = {
  hitAt1: 0.6400,
  hitAt3: 0.8200,
  mrr: 0.7144,
  ndcgAt3: 0.8750,
  benchmarkQueries: 150,
};

export const ESCALATION_METRICS = {
  precision: 0.6493,
  recall: 0.8204,
  f1: 0.7249,
};

export const RESPONSE_QUALITY = {
  overall: 1.724,
  tone: 1.907,
  grounding: 1.693,
  helpfulness: 1.620,
  scale: 2,
  benchmarkResponses: 150,
};

export interface FailureCategory {
  code: string;
  label: string;
  count: number;
}

export const FAILURE_ANALYSIS: FailureCategory[] = [
  { code: "INCOMPLETE_RESPONSE", label: "Incomplete response", count: 20 },
  { code: "FABRICATED_DETAIL", label: "Fabricated detail", count: 14 },
  { code: "MISSED_ESCALATION", label: "Missed escalation", count: 13 },
  { code: "UNSUPPORTED_ACTION", label: "Unsupported action", count: 13 },
  { code: "UNNECESSARY_ESCALATION", label: "Unnecessary escalation", count: 8 },
  { code: "IRRELEVANT_RESPONSE", label: "Irrelevant response", count: 6 },
  { code: "WRONG_INTENT", label: "Wrong intent", count: 5 },
];
