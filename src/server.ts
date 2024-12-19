import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';
import { validatorCompiler, serializerCompiler, ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { fastifySwagger } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { routes } from './routes';

//withTypeProvider<ZodTypeProvider>() => Configuration to swagger knows ZOD propriety
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "API With Zod",
            version: '1.0.0',
        }
    },
    transform: jsonSchemaTransform,
});

//Route to documentation. => http://localhost:3333/docs
app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
});

app.register(routes);

app.listen({ port: 3333 }).then(() => {
    console.log("HTTP server running!");
})