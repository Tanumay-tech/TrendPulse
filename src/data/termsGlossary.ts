export interface TermDefinition {
  term: string;
  category: 'Statistical Metric' | 'NLP & AI' | 'Market & Strategy' | 'Deep Tech';
  simpleMeaning: string;
  practicalInterpretation: string;
  formula?: string;
  example?: string;
}

export const TERMS_GLOSSARY: Record<string, TermDefinition> = {
  // Statistical & Anomaly Metrics
  zScore: {
    term: 'z-Score',
    category: 'Statistical Metric',
    formula: 'z = (x - μ) / σ',
    simpleMeaning: 'A mathematical measure of how unusually high or low an observed keyword count is compared to normal historical levels.',
    practicalInterpretation: 'Scores between 0 and 2 are normal noise. A score above 3.0 indicates a statistically significant anomaly—meaning a topic is exploding in volume far beyond normal fluctuations.',
    example: 'A z-score of 4.12 means this topic is happening 4.12 standard deviations above historical mean frequency.',
  },
  burstMultiplier: {
    term: 'Burst Multiplier',
    category: 'Statistical Metric',
    formula: 'Multiplier = F_current / F_baseline',
    simpleMeaning: 'The ratio comparing current posting frequency against the baseline rolling rate.',
    practicalInterpretation: 'Tells you how many times faster people are talking about this topic right now. A 4.5x multiplier means 450% more posts per minute than usual.',
    example: '5.2x frequency surge means mention speed jumped over 5-fold in the last observation window.',
  },
  velocityScore: {
    term: 'Velocity Score',
    category: 'Statistical Metric',
    formula: 'Velocity = d(Volume)/dt * MomentumFactor',
    simpleMeaning: 'A 0–100 index measuring the spread speed, acceleration, and repost momentum of a topic.',
    practicalInterpretation: 'High velocity (>80) signifies rapid organic sharing across social feeds; low velocity indicates steady, slow-moving conversation.',
    example: 'Score 94/100: Virally accelerating across X, Reddit, and YouTube simultaneously.',
  },
  volume: {
    term: 'Post Volume',
    category: 'Statistical Metric',
    formula: 'Volume = Σ (posts + reshares + comments)',
    simpleMeaning: 'The total estimated number of social media posts, comments, and mentions during the active observation window.',
    practicalInterpretation: 'Indicates sheer reach and community scale. High volume combined with high velocity confirms major market traction.',
    example: '184,500 posts sampled across X, Reddit, and YouTube in the last 24 hours.',
  },
  growthRate: {
    term: 'Growth Rate',
    category: 'Statistical Metric',
    formula: 'Δ% = ((V_t - V_t-1) / V_t-1) * 100%',
    simpleMeaning: 'Percentage increase in mentions compared to the previous observation period.',
    practicalInterpretation: 'Positive growth (+100% or more) highlights newly emerging or surging trends before they plateau.',
    example: '+342% means mentions more than quadrupled compared to the baseline period.',
  },
  poissonDivergence: {
    term: 'Poisson Divergence',
    category: 'Statistical Metric',
    formula: 'P(k; λ) = (λ^k · e^(-λ)) / k!',
    simpleMeaning: 'Statistical hypothesis test identifying arrival rate anomalies where arrival counts k deviate from expected rate λ.',
    practicalInterpretation: 'Used to mathematically separate natural steady organic discussion from sudden coordinated or viral flashpoint spikes.',
    example: 'Surge divergence detected when post arrivals exceed the 99.7th percentile of the Poisson distribution.',
  },
  slidingWindow: {
    term: 'Sliding Window',
    category: 'Statistical Metric',
    formula: 'Window = [t - Δt, t]',
    simpleMeaning: 'A rolling observation timeframe (e.g. 15m, 1h, 24h) that continuously updates as new posts arrive.',
    practicalInterpretation: 'Ensures metrics reflect what is happening right now rather than being weighed down by stale data from days ago.',
  },

  // NLP, Semantic Clustering & AI
  cosineVectorSpace: {
    term: 'Cosine Vector Space',
    category: 'NLP & AI',
    formula: 'cos(θ) = (A · B) / (||A|| · ||B||)',
    simpleMeaning: 'Mathematical similarity calculation measuring the cosine angle between two high-dimensional text embedding vectors.',
    practicalInterpretation: 'Values close to 1.0 indicate virtually identical semantic meanings; values near 0 mean topics have unrelated contexts.',
    example: 'Vector cosine similarity of 0.88 confirms "Multi-Agent Swarms" and "Tool Calling" share identical semantic neighborhoods.',
  },
  latentVector: {
    term: '2D Latent Vector Projection',
    category: 'NLP & AI',
    formula: 'Projection: ℝ^1536 → ℝ^2 (t-SNE / UMAP)',
    simpleMeaning: 'A visual map where 1536-dimensional AI post embeddings are mathematically projected into 2D coordinates.',
    practicalInterpretation: 'Posts and entities that discuss similar themes automatically land near each other, forming visible clusters.',
    example: 'Topics related to AI agents and reasoning models cluster together in the upper-left quadrant.',
  },
  kmeans: {
    term: 'k-Means Clustering',
    category: 'NLP & AI',
    formula: 'arg min_S Σ_i Σ_{x ∈ S_i} ||x - μ_i||²',
    simpleMeaning: 'Unsupervised machine learning algorithm that partitions social posts into k distinct semantic topic groups.',
    practicalInterpretation: 'Finds natural cluster centroids without human supervision, discovering emergent topics automatically.',
  },
  tsneProjection: {
    term: 't-SNE / UMAP Projection',
    category: 'NLP & AI',
    formula: 'KL(P || Q) = Σ_i Σ_j p_j|i · log(p_j|i / q_j|i)',
    simpleMeaning: 'Non-linear dimensionality reduction algorithms that preserve local and global neighborhood structures.',
    practicalInterpretation: 'Allows human analysts to visually explore complex high-dimensional semantic relationships on a 2D screen.',
  },
  unsupervisedClustering: {
    term: 'Unsupervised Semantic Clustering',
    category: 'NLP & AI',
    simpleMeaning: 'Automated semantic grouping of text vectors based on vector distance without pre-defined labels.',
    practicalInterpretation: 'Discovers new trending subcultures and technical niches as soon as they form.',
  },
  centroid: {
    term: 'Cluster Centroid',
    category: 'NLP & AI',
    formula: 'μ_c = (1 / |S_c|) Σ_{x ∈ S_c} x',
    simpleMeaning: 'The geometric and semantic center of a topic group.',
    practicalInterpretation: 'Represents the core theme anchor around which surrounding sub-topics and related keywords orbit.',
    example: 'Centroid at coordinates (28, 26) represents the core anchor for Autonomous Agent Frameworks.',
  },
  cohesionScore: {
    term: 'Cohesion Score',
    category: 'NLP & AI',
    formula: 'Cohesion = 1 - (AvgDist(x, μ_c) / MaxDist)',
    simpleMeaning: 'A 0–100% score rating how closely related and tightly packed the topics within a cluster are.',
    practicalInterpretation: 'Scores above 80% mean the cluster is unified and focused on a single coherent story rather than scattered noise.',
    example: 'Cohesion 94%: Highly focused discussion with minimal unrelated noise.',
  },
  sentimentPolarity: {
    term: 'Sentiment Polarity & Score',
    category: 'NLP & AI',
    formula: 'Score = (P_pos - P_neg) ∈ [-1.0, +1.0]',
    simpleMeaning: 'An emotional rating from -1.0 (strongly critical/skeptical) to +1.0 (strongly enthusiastic/positive).',
    practicalInterpretation: 'Tells you whether public mood is enthusiastic, optimistic, skeptical, or frustrated.',
    example: '+0.74 indicates strong positive excitement and developer enthusiasm.',
  },
  sentimentDistribution: {
    term: 'Sentiment Distribution',
    category: 'NLP & AI',
    formula: 'P_pos + P_neu + P_neg = 100%',
    simpleMeaning: 'The percentage split of public opinion across Positive, Neutral, and Negative sentiments.',
    practicalInterpretation: 'Shows controversy or consensus: a 68% positive / 10% negative split indicates broad favorable reception.',
  },
  entityToken: {
    term: 'Entity Token',
    category: 'NLP & AI',
    simpleMeaning: 'A key phrase, keyword, or named entity extracted by AI from social posts.',
    practicalInterpretation: 'These are the building blocks of trends, like #AgenticWorkflows or #Waveguides.',
  },
  executiveReport: {
    term: 'AI Executive Briefing',
    category: 'Market & Strategy',
    simpleMeaning: 'Structured narrative synthesis generated by Gemini API combining signals, anomalies, and outlook.',
    practicalInterpretation: 'Turns raw social telemetry into actionable decision-grade intelligence for founders and executives.',
  },
  streamIngestion: {
    term: 'Stream Ingestion Pipeline',
    category: 'Statistical Metric',
    simpleMeaning: 'Continuous real-time intake of social feeds parsing hundreds of posts per second into clean data.',
    practicalInterpretation: 'Keeps the radar updated live as viral events unfold without waiting for batch jobs.',
  },
};

/**
 * Helper to match any text or keyword to a definition
 */
export function lookupTerm(query: string): TermDefinition | null {
  if (!query) return null;
  const normalized = query.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const [key, def] of Object.entries(TERMS_GLOSSARY)) {
    const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const termNorm = def.term.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (keyNorm === normalized || termNorm === normalized) return def;
  }

  // Partial match
  for (const def of Object.values(TERMS_GLOSSARY)) {
    const termNorm = def.term.toLowerCase();
    if (termNorm.includes(query.toLowerCase()) || query.toLowerCase().includes(termNorm)) {
      return def;
    }
  }

  return null;
}
