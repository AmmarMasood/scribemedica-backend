"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const rawBody_middleware_1 = require("./middlewares/rawBody.middleware");
require('dotenv').config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.init();
    app.enableCors();
    app.use((0, rawBody_middleware_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    const port = process.env.SERVER_PORT || 3000;
    await app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map