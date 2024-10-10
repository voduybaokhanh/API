const swaggerJSDoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API của Bảo Khánh',
      version: '1.0.0',
      description: 'Viết chơi API',
    },
  },
  apis: ['./routes/*.js'], // Đường dẫn đến các file định nghĩa API
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
