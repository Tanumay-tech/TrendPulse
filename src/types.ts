export type PlatformType = 'twitter' | 'reddit' | 'youtube' | 'all';

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'reddit' | 'youtube';
  author: string;
  handle: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  keywords: string[];
  burstAlert?: boolean;
  topicTag?: string;
}

export interface VolumeHistoryPoint {
  time: string;
  volume: number;
  isAnomaly?: boolean;
  positive: number;
  neutral: number;
  negative: number;
}

export interface DetectedTrend {
  id: string;
  name: string;
  category: string;
  growthRate: number; // e.g. 185 for +185%
  volume: number;
  velocityScore: number; // 0-100
  sentimentScore: number; // -1 to 1
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  burstAnomaly: boolean;
  zScore: number; // e.g. 3.8
  burstMultiplier: number; // e.g. 4.2x
  relatedKeywords: string[];
  platforms: ('twitter' | 'reddit' | 'youtube')[];
  summary: string;
  history: VolumeHistoryPoint[];
  clusterId: string;
  clusterX: number;
  clusterY: number;
}

export interface AnomalyAlert {
  id: string;
  trendName: string;
  keyword: string;
  detectedAt: string;
  burstMultiplier: number;
  zScore: number;
  severity: 'critical' | 'high' | 'moderate';
  summary: string;
  affectedPlatform: 'twitter' | 'reddit' | 'youtube' | 'multi';
}

export interface ClusterNode {
  id: string;
  label: string;
  clusterId: string;
  x: number;
  y: number;
  weight: number; // node radius size
  growthRate: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
}

export interface TopicCluster {
  clusterId: string;
  name: string;
  themeColor: string;
  cohesionScore: number; // 0-100
  memberCount: number;
  centroid: { x: number; y: number };
  keywords: string[];
  nodes: ClusterNode[];
  summary: string;
  dominantSentiment: 'positive' | 'neutral' | 'negative';
}

export interface ExecutiveReport {
  id: string;
  title: string;
  generatedAt: string;
  timeframe: string;
  analyzedPostCount: number;
  activeTrendCount: number;
  anomalyCount: number;
  executiveSummary: string;
  emergingSignals: {
    signal: string;
    impact: string;
    growth: string;
    confidence: number;
  }[];
  anomalyAnalysis: string;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  strategicRecommendations: {
    priority: 'Immediate Action' | 'High Opportunity' | 'Strategic Watchlist';
    action: string;
    rationale: string;
  }[];
  riskAndOpportunityMatrix: {
    theme: string;
    opportunity: string;
    threat: string;
  }[];
}

export interface StreamAnalysisRequest {
  posts: {
    platform: 'twitter' | 'reddit' | 'youtube';
    content: string;
    author?: string;
  }[];
}
