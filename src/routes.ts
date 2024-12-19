import { randomUUID } from "node:crypto";
import type { FastifyTypedInstance } from "./types";
import z from 'zod';

interface User {
    id: string
    name: string
    email: string
}

//Simulation a DB server
const users: User[] = [
    {id: "1", name: "Jhon", email: "jhon@email.com"},
    {id: "2", name: "Clark", email: "clark@email.com"},
]


export async function routes(app: FastifyTypedInstance) {

    app.get('/users', {
        schema: {
            description:"List User",
            tags: ['users'],
            response: {
                200: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    //Here not need check if email is valid just if it a string because is only response, we have to do all validation this on request.
                    email: z.string(),
                }))
            }
        }
    }, () => {
        return users;
    });

    /*
        The second parameter on app.post is Zod and Swagger configuration.
        The third is return of function.
    */
    app.post('/users', {
        schema: {
            description:"Create User",
            tags: ['users'],
            body: z.object({
                name: z.string(),
                email: z.string().email(),
            }),
            response: {
                201: z.null().describe("User Created"),
            },
        }
    },async (request, reply) => {
        const { email, name } = request.body;

        users.push({
            id: randomUUID(),
            name,
            email
        });

        return reply.status(201).send();
    });

}