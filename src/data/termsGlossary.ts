export interface TermDefinition {
  term: string;
  category: 'Statistical Metric' | 'NLP & AI' | 'Market & Strategy' | 'Deep Tech';
  simpleMeaning: string;
  practicalInterpretation: string;
  example?: string;
}

export const TERMS_GLOSSARY: Record<string, TermDefinition> = {
  // Statistical & Anomaly Metrics
  zScore: {
    term: 'z-Score',
    category: 'Statistical Metric',
    simpleMeaning: 'A mathematical measure of how unusually high or low a number is compared to normal historical levels.',
    practicalInterpretation: 'Scores between 0 and 2 are normal noise. A score above 3.0 indicates a statistically significant anomaly—meaning a topic is exploding in volume far beyond normal fluctuations.',
    example: 'A z-score of 4.12 means this topic is happening 4 standard deviations above typical background chatter.',
  },
  burstMultiplier: {
    term: 'Burst Multiplier',
    category: 'Statistical Metric',
    simpleMeaning: 'The ratio comparing current posting frequency against the baseline rate.',
    practicalInterpretation: 'Tells you how many times faster people are talking about this topic right now. A 4.5x multiplier means 450% more posts per minute than usual.',
    example: '4.8x frequency surge means mention speed jumped almost 5-fold in the last observation window.',
  },
  velocityScore: {
    term: 'Velocity Score',
    category: 'Statistical Metric',
    simpleMeaning: 'A 0–100 index measuring the spread speed, acceleration, and repost momentum of a topic.',
    practicalInterpretation: 'High velocity (>80) signifies rapid organic sharing across social feeds; low velocity indicates steady, slow-moving conversation.',
    example: 'Score 92/100: Virally accelerating across multiple platforms simultaneously.',
  },
  volume: {
    term: 'Post Volume',
    category: 'Statistical Metric',
    simpleMeaning: 'The total estimated number of social media posts, comments, and mentions during the active observation window.',
    practicalInterpretation: 'Indicates sheer reach and community scale. High volume combined with high velocity confirms major market traction.',
    example: '52,400 posts sampled across X, Reddit, and YouTube in the last 24 hours.',
  },
  growthRate: {
    term: 'Growth Rate',
    category: 'Statistical Metric',
    simpleMeaning: 'Percentage increase in mentions compared to the previous time period.',
    practicalInterpretation: 'Positive growth (+100% or more) highlights newly emerging or surging trends before they plateau.',
    example: '+240% means mentions more than tripled compared to yesterday.',
  },
  poissonDivergence: {
    term: 'Poisson Divergence',
    category: 'Statistical Metric',
    simpleMeaning: 'A test that detects if social posts are arriving in unnatural sudden bursts rather than random steady intervals.',
    practicalInterpretation: 'Used to filter out steady background talk from sudden viral flashpoints.',
  },
  slidingWindow: {
    term: 'Sliding Window',
    category: 'Statistical Metric',
    simpleMeaning: 'A rolling observation timeframe (e.g. 15m, 1h, 24h) that continuously updates as new posts arrive.',
    practicalInterpretation: 'Ensures metrics reflect what is happening right now rather than being weighed down by stale data from days ago.',
  },

  // NLP, Semantic Clustering & AI
  latentVector: {
    term: '2D Latent Vector Projection',
    category: 'NLP & AI',
    simpleMeaning: 'A visual map where complex AI post representations are compressed into 2D coordinates.',
    practicalInterpretation: 'Posts and entities that discuss similar themes automatically land near each other, forming visible clusters.',
    example: 'Topics related to AI chips and local models cluster together on the map.',
  },
  centroid: {
    term: 'Cluster Centroid',
    category: 'NLP & AI',
    simpleMeaning: 'The geometric and semantic focal center of a topic group.',
    practicalInterpretation: 'Represents the core theme anchor around which surrounding sub-topics and related keywords orbit.',
    example: 'Centroid at coordinates (32, 28) represents the core anchor for Autonomous Agent tooling.',
  },
  cohesionScore: {
    term: 'Cohesion Score',
    category: 'NLP & AI',
    simpleMeaning: 'A 0–100% score rating how closely related the topics within a cluster are.',
    practicalInterpretation: 'Scores above 80% mean the cluster is unified and focused on a single coherent story rather than scattered topics.',
    example: 'Cohesion 91%: Highly focused discussion with minimal unrelated noise.',
  },
  sentimentPolarity: {
    term: 'Sentiment Polarity & Score',
    category: 'NLP & AI',
    simpleMeaning: 'An emotional rating from -1.0 (strongly negative) to +1.0 (strongly positive).',
    practicalInterpretation: 'Tells you whether public mood is enthusiastic, optimistic, skeptical, or frustrated.',
    example: '+0.68 indicates strong positive excitement and developer enthusiasm.',
  },
  sentimentDistribution: {
    term: 'Sentiment Distribution',
    category: 'NLP & AI',
    simpleMeaning: 'The percentage split of public opinion across Positive, Neutral, and Negative sentiments.',
    practicalInterpretation: 'Shows controversy or consensus: a 65% positive / 10% negative split indicates broad favorable reception.',
  },
  entityToken: {
    term: 'Entity Token',
    category: 'NLP & AI',
    simpleMeaning: 'A key phrase, keyword, or named entity extracted by AI from social posts.',
    practicalInterpretation: 'These are the building blocks of trends, like #AgenticWorkflows or #SolidState.',
  },
  quantization: {
    term: 'Quantization',
    category: 'Deep Tech',
    simpleMeaning: 'Compressing large AI neural networks into smaller sizes (e.g. 4-bit) so they run on standard laptops and phones.',
    practicalInterpretation: 'Enables private, fast AI reasoning without needing expensive cloud servers.',
  },
  openWeight: {
    term: 'Open-Weight Models',
    category: 'Deep Tech',
    simpleMeaning: 'AI models whose internal mathematical weights are shared publicly for anyone to run locally.',
    practicalInterpretation: 'Allows enterprises to run AI completely privately with zero third-party platform lock-in.',
  },
  autonomousAgents: {
    term: 'Autonomous Agents',
    category: 'Deep Tech',
    simpleMeaning: 'AI programs that can plan multi-step actions, call external tools, and solve complex tasks on their own.',
    practicalInterpretation: 'A major technological leap from simple chatbots to automated task execution.',
  },
  spatialComputing: {
    term: 'Spatial Computing',
    category: 'Deep Tech',
    simpleMeaning: 'Wearable technology (like smart glasses) projecting virtual elements directly into physical sight.',
    practicalInterpretation: 'Lightweight waveguides and micro-OLED displays enable glasses under 50 grams.',
  },
  solidStateBattery: {
    term: 'Solid-State Battery',
    category: 'Deep Tech',
    simpleMeaning: 'Next-generation batteries that replace flammable liquid electrolytes with solid material.',
    practicalInterpretation: 'Promises double the energy density, 10-minute fast charging, and zero fire risk.',
  },
  superconductor: {
    term: 'Diamagnetic Levitation / Superconductors',
    category: 'Deep Tech',
    simpleMeaning: 'Materials that conduct electricity with zero electrical resistance and repel magnetic fields.',
    practicalInterpretation: 'Often subject to intense viral social speculation; requires peer-reviewed lab replication.',
  },

  // Market & Strategy
  confidenceIndex: {
    term: 'Confidence Index',
    category: 'Market & Strategy',
    simpleMeaning: 'An algorithmic estimate (0–100%) that an observed trend is real and durable, not temporary bot spam.',
    practicalInterpretation: 'Derived from cross-platform consensus between X, Reddit, and YouTube.',
    example: 'Confidence 96%: Verified across distinct platforms and reputable creators.',
  },
  immediateAction: {
    term: 'Immediate Action Priority',
    category: 'Market & Strategy',
    simpleMeaning: 'The highest tier recommendation requiring prompt executive decision or resource allocation.',
    practicalInterpretation: 'Indicates a trend with immediate operational impact or rapid competitor movement.',
  },
  highOpportunity: {
    term: 'High Opportunity Priority',
    category: 'Market & Strategy',
    simpleMeaning: 'A favorable emerging market window with strong upside potential.',
    practicalInterpretation: 'Ideal for prototyping, pilot experiments, or content strategy positioning.',
  },
  strategicWatchlist: {
    term: 'Strategic Watchlist',
    category: 'Market & Strategy',
    simpleMeaning: 'High-velocity but unconfirmed developments kept under automated monitoring.',
    practicalInterpretation: 'Prevents premature capital expenditure while keeping leadership informed.',
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
