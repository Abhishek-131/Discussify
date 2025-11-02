import express from "express";
const app = express();

app.use(express.json());
app.post("/test", (req, res) => {
  console.log("Received body:", req.body);
  res.json({ received: req.body });
});

app.listen(4000, () => console.log("Test server on port 4000"));
