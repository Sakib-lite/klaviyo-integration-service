import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';

const swaggerCustomCss = `
.swagger-ui .model-box-control:focus, .swagger-ui .models-control:focus, .swagger-ui .opblock-summary-control:focus {
  outline: none
}
`;

const swaggerCustomJs = `
window.addEventListener('load', function() {
  // Function to clear pre-filled values and set placeholders
  function setPlaceholders() {
    // Wait for Swagger UI to render
    setTimeout(() => {
      const textareas = document.querySelectorAll('.body-param__text');
      const inputs = document.querySelectorAll('.parameters input[type="text"]');

      // Handle textarea (request body)
      textareas.forEach(textarea => {
        if (textarea.value && textarea.value.trim() !== '') {
          try {
            const jsonValue = JSON.parse(textarea.value);
            // Clear the textarea
            textarea.value = '';
            // Set placeholder with formatted JSON
            textarea.placeholder = JSON.stringify(jsonValue, null, 2);
          } catch (e) {
            // If not JSON, just set as placeholder
            const originalValue = textarea.value;
            textarea.value = '';
            textarea.placeholder = originalValue;
          }
        }
      });

      // Handle input fields (query parameters)
      inputs.forEach(input => {
        if (input.value && input.value.trim() !== '') {
          const originalValue = input.value;
          input.value = '';
          input.placeholder = originalValue;
        }
      });
    }, 500);
  }

  // Run on initial load
  setPlaceholders();

  // Re-run when "Try it out" is clicked
  const observer = new MutationObserver(setPlaceholders);
  observer.observe(document.body, { childList: true, subtree: true });
});
`;

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export const setupSwagger = async (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Klaviyo backend integration')
    .setDescription('API for managing external service')
    .setVersion('1.0.0')
    .addServer(APP_URL)
    .addBearerAuth(undefined, 'Apikey')
    .addBearerAuth(undefined, 'Authorization')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}-${methodKey}`.toLowerCase(),
  };

  const privateDocument = SwaggerModule.createDocument(app, config, options);

  privateDocument.paths = Object.keys(privateDocument.paths)
    .filter((path) => path.includes('/private'))
    .reduce<Record<string, any>>((obj, key) => {
      obj[key] = privateDocument.paths[key];
      return obj;
    }, {});

  fs.writeFileSync(
    './public/private-swagger-spec.json',
    JSON.stringify(privateDocument),
  );

  // Write custom JS to a file
  const publicDir = './public';
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(`${publicDir}/swagger-custom.js`, swaggerCustomJs);

  const customOptions: SwaggerCustomOptions = {
    customCss: swaggerCustomCss,
    customJs: '/swagger-custom.js',
    swaggerOptions: {
      persistAuthorization: true,
      validatorUrl: 'https://validator.swagger.io/validator',
      requestSnippetsEnabled: false,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
      displayRequestDuration: true,
    },
    customSiteTitle: 'Klaviyo backend integration',
    customfavIcon: '/favicon.ico',
  };

  SwaggerModule.setup('api/docs', app, privateDocument, customOptions);
};
