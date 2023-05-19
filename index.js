const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Import routes
const usersRoutes = require("./routes/users.routes");
// Use routes
app.use("/api/v1/users", usersRoutes);

// Import routes
const postsRoutes = require("./routes/posts.routes");
// Use routes
app.use("/api/v1/posts", postsRoutes);

// bonus
app.get("/api/v1/:userId/posts", (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    res.status(404).json({
      message: "Posts not found",
    });
  } else {
    fs.readFile("./dev-data/posts.json", (err, data) => {
      if (err) throw err;
      const posts = JSON.parse(data);
      const post = posts.filter((post) => post.userId === parseInt(userId));
      res.status(200).json(post);
    });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
