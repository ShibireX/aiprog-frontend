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

export const SAVE_PAPER = `
  mutation SavePaper($input: SavePaperInput!) {
    savePaper(input: $input) {
      id
      userId
      paperId
      paper {
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
      notes
      tags
      createdAt
    }
  }
`;

export const UNSAVE_PAPER = `
  mutation UnsavePaper($paperId: String!) {
    unsavePaper(paperId: $paperId)
  }
`;

export const REGISTER_USER = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const LOGIN_USER = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        username
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CURRENT_USER = `
  query GetCurrentUser {
    me {
      id
      email
      username
      createdAt
      updatedAt
    }
  }
`;

export const GET_SAVED_PAPERS = `
  query GetSavedPapers($limit: Int = 10, $offset: Int = 0, $folderId: String) {
    getSavedPapers(limit: $limit, offset: $offset, folderId: $folderId) {
      id
      userId
      paperId
      folderId
      paper {
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
      notes
      tags
      createdAt
    }
  }
`;

export const GET_FOLDERS = `
  query GetFolders {
    getFolders {
      id
      name
      paperCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_FOLDER_WITH_PAPERS = `
  query GetFolderWithPapers($id: String!) {
    getFolder(id: $id) {
      id
      name
      paperCount
      createdAt
      updatedAt
      papers {
        id
        folderId
        notes
        tags
        createdAt
        paper {
          id
          title
          authors
          year
          abstract
          venue
          citationCount
        }
      }
    }
  }
`;

export const CREATE_FOLDER = `
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      id
      name
      paperCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FOLDER = `
  mutation UpdateFolder($id: String!, $input: UpdateFolderInput!) {
    updateFolder(id: $id, input: $input) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_FOLDER = `
  mutation DeleteFolder($id: String!) {
    deleteFolder(id: $id)
  }
`;

export const MOVE_PAPER_TO_FOLDER = `
  mutation MovePaperToFolder($paperId: String!, $folderId: String) {
    movePaperToFolder(paperId: $paperId, folderId: $folderId) {
      id
      folderId
      paper {
        id
        title
      }
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
