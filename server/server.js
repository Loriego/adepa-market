import express from "express";

import cors from "cors";

import { admin, db } from "./firebaseAdmin.js";

const app = express();

app.use(cors());

app.use(express.json());

app.post("/send-notification", async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: "Title and body are required",
      });
    }

    const snapshot = await db
      .collection("notificationTokens")
      .get();

    const tokens = snapshot.docs
      .map((doc) => doc.data().token)
      .filter(Boolean);

    if (tokens.length === 0) {
      return res.status(404).json({
        error: "No notification tokens found",
      });
    }

    const response =
      await admin.messaging().sendEachForMulticast({
        notification: {
          title,
          body,
        },

        tokens,
      });

    res.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to send notification",
    });
  }
});

app.listen(5000, () => {
  console.log(
    "🔥 Notification server running on http://localhost:5000"
  );
});