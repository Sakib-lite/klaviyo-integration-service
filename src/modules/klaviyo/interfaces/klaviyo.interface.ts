export interface KlaviyoEventPayload {
  data: {
    type: string;
    attributes: {
      properties: object;
      metric: {
        data: {
          type: string;
          attributes: {
            name: string;
          };
        };
      };
      profile: {
        data: {
          type: string;
          attributes: object;
        };
      };
    };
  };
}

export interface KlaviyoMetric {
  id: string;
  type: string;
  attributes: {
    name: string;
    created: string;
    updated: string;
    integration: {
      object: string;
      id: string;
      name: string;
      category: string;
    };
  };
}

export interface KlaviyoProfile {
  id: string;
  type: string;
  attributes: {
    email: string;
    phone_number?: string;
    first_name?: string;
    last_name?: string;
    organization?: string;
    title?: string;
    image?: string;
    created: string;
    updated: string;
    properties?: object;
  };
}

export interface KlaviyoEvent {
  id: string;
  type: string;
  attributes: {
    timestamp: number;
    event_properties: object;
    datetime: string;
    uuid: string;
  };
  relationships?: {
    profile?: {
      data?: {
        type: string;
        id: string;
      };
    };
    metric?: {
      data?: {
        type: string;
        id: string;
      };
    };
  };
}
