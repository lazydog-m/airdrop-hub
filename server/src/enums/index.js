const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  FORBIDDEN: "403",
  BAD_REQUEST: 400,
  VALIDATION: 422,
  UNAUTHORIZED: 401,
};

const Message = {
  SUCCESS: "Success!",
  ERROR: "Error unknown!",
};

const HttpStatusCode = {
  OK: "OK",
  CREATED: "CREATED",
  NO_CONTENT: "NO_CONTENT",
  NOT_FOUND: "NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
  FORBIDDEN: "FORBIDDEN",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION: "VALIDATION",
  UNAUTHORIZED: "UNAUTHORIZED",
};

const Metadata = {
  name: "AirdropHub",
}

const ProjectStatus = {
  PENDING: 'pending',
  DOING: 'doing',
  ENDED: 'ended',
}

const ProjectType = {
  DEPIN: 'depin',
  TESTNET: 'testnet',
}

const ProjectRating = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

module.exports = {
  HttpStatus,
  Message,
  Metadata,
  ProjectStatus,
  ProjectType,
  ProjectRating,
  HttpStatusCode,
};
