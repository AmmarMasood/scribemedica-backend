"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const rawBody_middleware_1 = require("./middlewares/rawBody.middleware");
require('dotenv').config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    console.log('something....app');
    app.use((0, rawBody_middleware_1.default)());
    await app.init();
    console.log('something....app 2');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map