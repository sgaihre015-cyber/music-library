const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUiDist = require('swagger-ui-dist');

const outputDir = path.resolve(__dirname, '..', '..', 'APIDOC');
fs.mkdirSync(outputDir, { recursive: true });

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Music Library API',
      version: '1.0.0',
      description: 'REST API for managing tracks in a music library'
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: [path.join(__dirname, 'app.js')]
});

fs.writeFileSync(path.join(outputDir, 'openapi.json'), JSON.stringify(spec, null, 2));

const swaggerPath = swaggerUiDist.getAbsoluteFSPath();
for (const file of fs.readdirSync(swaggerPath)) {
  fs.copyFileSync(path.join(swaggerPath, file), path.join(outputDir, file));
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Music Library API Docs</title>
    <link rel="stylesheet" href="./swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="./swagger-ui-bundle.js"></script>
    <script src="./swagger-ui-standalone-preset.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: './openapi.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'BaseLayout'
      });
    </script>
  </body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), html);

// eslint-disable-next-line no-console
console.log(`Docs generated at ${outputDir}`);
