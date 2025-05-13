import express from "express";
import jwt from "jsonwebtoken";

import { middleware } from "./middleware";

import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema } from "@repo/common/types";
const app = express();
app.post("/signup", (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (data.error) {
    res.json({ message: data.error });

    return;
  }
  // db call

  

  res.json({
    message: "User created successfully",
  });
});

app.post("/signin", (req, res) => {
  const userId = 1;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );
  res.json({ token });
});

app.post("/room", middleware, (req, res) => {
  // db call

  res.json({
    roomId: 123,
  });
});

app.listen(8000, () => {
  console.log("http server running at http://localhost:8000");
});
