
export interface AnalysisResult {
  score: number;
  perceivedReach: {
    status: 'Low' | 'Moderate' | 'High';
    explanation: string;
  };
  algorithmicAnalysis: {
    throttlingFactors: string[];
    dwellTimeCritique: string;
  };
  mistakes: {
    madeInThisPost: string[];
    toAvoidNextTime: string[];
  };
  engagementStrategy: {
    toGetMoreLikes: string;
    toGetMoreReactions: string;
    toGetMoreComments: string;
  };
  nextPostBlueprint: {
    recommendedTopic: string;
    suggestedFormat: string;
    whyThisTopic: string;
  };
  metricBreakdown: {
    hook: number;
    value: number;
    formatting: number;
  };
}

export interface PostData {
  url: string;
  content: string;
}
