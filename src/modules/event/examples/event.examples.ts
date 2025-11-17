export const createEventRequestExamples = {
  'Active on Site': {
    summary: 'Example: Customer active on site',
    value: {
      eventName: 'Active on Site',
      eventAttributes: {
        page: '/home',
        source: 'web',
      },
      profileAttributes: {
        email: 'customer@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '+1234567890',
      },
    },
  },
  'Viewed Product': {
    summary: 'Example: Customer viewed a product',
    value: {
      eventName: 'Viewed Product',
      eventAttributes: {
        productId: 'PROD-789',
        productName: 'Laptop',
        price: 1299.99,
      },
      profileAttributes: {
        email: 'customer@example.com',
        first_name: 'John',
      },
    },
  },
};

export const createEventResponseExamples = {
  success: {
    summary: 'Event created successfully',
    value: {
      success: true,
      message: 'Event created successfully',
      data: {
        id: 1,
        eventName: 'Active on Site',
        createdAt: '2024-11-17T10:30:00.000Z',
      },
    },
  },
};

export const createBulkEventsRequestExamples = {
  'Multiple Events': {
    summary: 'Example: Create multiple events at once',
    value: {
      events: [
        {
          eventName: 'Active on Site',
          eventAttributes: {
            page: '/home',
            source: 'web',
          },
          profileAttributes: {
            email: 'customer1@example.com',
            first_name: 'John',
            last_name: 'Doe',
          },
        },
        {
          eventName: 'Viewed Product',
          eventAttributes: {
            productId: 'PROD-123',
            productName: 'Laptop',
            price: 1299.99,
          },
          profileAttributes: {
            email: 'customer2@example.com',
            first_name: 'Jane',
            last_name: 'Smith',
          },
        },
      ],
    },
  },
};

export const createBulkEventsResponseExamples = {
  success: {
    summary: 'Bulk events created successfully',
    value: {
      success: true,
      message: 'Bulk events created successfully',
      data: {
        created: 2,
        failed: 0,
        details: [
          {
            id: 1,
            eventName: 'Active on Site',
            createdAt: '2024-11-17T10:30:00.000Z',
          },
          {
            id: 2,
            eventName: 'Viewed Product',
            createdAt: '2024-11-17T10:30:05.000Z',
          },
        ],
      },
    },
  },
};
