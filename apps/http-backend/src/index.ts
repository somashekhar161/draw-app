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

app.listen(8000, () => {
  console.log("http server running at http://localhost:8000");
});
