/**
 * Express HTTP backend server for user authentication, room creation, and chat message retrieval.
 *
 * ## Endpoints
 *
 * - `POST /signup`: Registers a new user. Expects a request body matching `CreateUserSchema`.
 *   - Hashes the password before storing.
 *   - Returns a success message and user data, or appropriate error messages for validation, duplicate user, or server errors.
 *
 * - `POST /signin`: Authenticates a user. Expects a request body matching `SigninSchema`.
 *   - Validates credentials and returns a JWT token on success.
 *   - Returns error messages for invalid credentials or validation errors.
 *
 * - `POST /room`: Creates a new chat room. Protected by authentication middleware.
 *   - Expects a request body matching `CreateRoomSchema`.
 *   - Associates the room with the authenticated user as admin.
 *   - Returns the created room data or error messages for duplicate room names or creation errors.
 *
 * - `GET /chat/:roomId`: Retrieves the latest 50 chat messages for a given room, ordered by descending ID.
 *   - Returns an array of chat messages.
 *
 * ## Middleware
 * - Uses a custom authentication middleware to protect the `/room` endpoint.
 *
 * ## Dependencies
 * - Express for HTTP server.
 * - Prisma for database access.
 * - bcryptjs for password hashing.
 * - jsonwebtoken for JWT authentication.
 * - Zod schemas for request validation.
 *
 * ## Configuration
 * - JWT secret is imported from shared configuration.
 * - Prisma client is imported from shared database module.
 *
 * ## Server
 * - Listens on port 8000.
 */
import express from "express";
import jwt from "jsonwebtoken";

import { middleware } from "./middleware";

import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prisma, prismaClient } from "@repo/db/client";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const data = CreateUserSchema.safeParse(req.body);
  if (data.error) {
    res.json({ message: data.error });

    return;
  }
  try {
    const hasedPassword = bcrypt.hashSync(data.data.password, 5);
    // db call
    const dbRes = await prismaClient.user.create({
      data: {
        ...data.data,
        password: hasedPassword,
      },
    });
    if (dbRes) {
      res.json({
        message: "User created successfully",
        data: dbRes,
      });
      return;
    }
    res.status(400).json({ message: "failed to sign up user" });
  } catch (error) {
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({ message: "User already exists" });
      }
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.post("/signin", async (req, res) => {
  const { error, data } = SigninSchema.safeParse(req.body);
  if (error) {
    res.json({ message: error });

    return;
  }
  const user = await prismaClient.user.findFirst({
    where: { email: data.email },
  });
  if (!user) {
    res.status(401).json({ message: "user not found" });
    return;
  }
  const validPassword = bcrypt.compareSync(data.password, user.password);
  if (!validPassword) {
    res.status(401).json({ message: "invalid password" });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({ token });
});

app.post("/room", middleware, async (req, res) => {
  const { error, data } = CreateRoomSchema.safeParse(req.body);
  if (error) {
    res.json({ message: error });
    return;
  }
  try {
    const userId = req.userId;
    const dbRes = await prismaClient.room.create({
      data: {
        slug: data.name,
        adminId: userId,
      },
    });
    if (!dbRes) {
      res.status(400).json({ message: "failed to create room" });
      return;
    }

    res.json({ message: " room created", data: dbRes });
  } catch (error) {
    if (error instanceof prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({ message: "room name already exists" });
        return;
      }
    } else {
      res.status(400).json({ message: "error creating  room" });
    }
  }
});

app.get("/chat/:roomId", async function (req, res) {
  const roomId = Number(req.params.roomId);

  const messages = await prismaClient.chat.findMany({
    where: {
      roomId: roomId,
    },
    take: 50,
    orderBy: {
      id: "desc",
    },
  });
  res.json({ data: messages });
});

app.get("/room/:slug", async function (req, res) {
  const slug = String(req.params.slug);

  const room = await prismaClient.room.findFirst({
    where: {
      slug: slug,
    },
  });
  res.json({ data: room });
});
app.listen(8000, () => {
  console.log("http server running at http://localhost:8000");
});
