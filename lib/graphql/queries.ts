// GraphQL queries for the search functionality

export const SEARCH_PAPERS = `
  query SearchPapers(
    $query: String!
    $limit: Int = 10
    $offset: Int = 0
  ) {
    searchPapers(
      query: $query
      limit: $limit
      offset: $offset
    ) {
      papers {
        id
        semanticScholarId
        title
        authors
        abstract
        year
        venue
        url
        citationCount
        tldr {
          model
          text
        }
      }
      total
      offset
      next
    }
  }
`;

export const GET_PUBLICATION_DETAILS = `
  query GetPublicationDetails($id: ID!) {
    publication(id: $id) {
      id
      title
      authors {
        id
        name
        affiliation
        orcid
      }
      abstract
      fullText
      publishedDate
      journal {
        id
        name
        issn
        impactFactor
      }
      doi
      url
      tags
      keywords
      citations {
        count
        recentCount
        citingPapers {
          id
          title
          publishedDate
        }
      }
      references {
        id
        title
        publishedDate
      }
      metrics {
        downloads
        views
        altmetricScore
        fieldWeightedCitationImpact
      }
      relatedPublications {
        id
        title
        authors {
          name
        }
        similarity
      }
    }
  }
`;

export const SEARCH_AUTHORS = `
  query SearchAuthors($query: String!, $limit: Int = 10) {
    searchAuthors(query: $query, limit: $limit) {
      id
      name
      affiliation
      orcid
      hIndex
      totalCitations
      publicationCount
      recentPublications {
        id
        title
        publishedDate
      }
    }
  }
`;

export const GET_TRENDING_TOPICS = `
  query GetTrendingTopics($timeframe: TimeframeInput = LAST_30_DAYS) {
    trendingTopics(timeframe: $timeframe) {
      topic
      publicationCount
      growthRate
      recentPublications {
        id
        title
        publishedDate
      }
    }
  }
`;

// Input types for GraphQL mutations and queries
export interface SearchFiltersInput {
  dateRange?: {
    from: string;
    to: string;
  };
  authors?: string[];
  journals?: string[];
  tags?: string[];
  citationRange?: {
    min: number;
    max?: number;
  };
  publicationType?: string[];
}

export interface TimeframeInput {
  LAST_7_DAYS: 'LAST_7_DAYS';
  LAST_30_DAYS: 'LAST_30_DAYS';
  LAST_90_DAYS: 'LAST_90_DAYS';
  LAST_YEAR: 'LAST_YEAR';
}
