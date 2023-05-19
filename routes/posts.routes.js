const express = require("express");
const router = express.Router();

const fs = require("fs");

// API lấy thông tin một post theo Id
router.get("/:id", (req, res) => {
    // La Id tu param
    const id = req.params.id;
    console.log(id);
    // Read file
    fs.readFile("./dev-data/posts.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const posts = JSON.parse(data);
        const post = posts.find((el) => el.id === +id);
        if (post) {
          return res.status(200).json({
            status: "success",
            data: post,
          });
        } else {
          return res.status(404).json({
            status: "success",
            message: "post not found",
          });
        }
      }
    });
  });
  
  // API lấy thông tin của tất cả posts
  router.get("/", (req, res) => {
    // Read file
    fs.readFile("./dev-data/posts.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const posts = JSON.parse(data);
        return res.status(200).json({
          status: "success",
          results: posts.length,
          data: posts,
        });
      }
    });
  });
  
  // Thêm mới một post
  router.post("/", (req, res) => {
    // Lấy dữ liệu từ phần body
    const { title, body } = req.body;
  
    // ĐỌc file
    fs.readFile("./dev-data/posts.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const posts = JSON.parse(data);
        const id = posts[posts.length - 1].id + 1;
        console.log(id);
        const newpost = {
          userId: 1,
          id: id,
          title: title,
          body: body
        };
        // Thêm vào db
        posts.push(newpost);
        fs.writeFileSync("./dev-data/posts.json", JSON.stringify(posts));
        return res.status(200).json({
          status: "success",
          message: "Created successfully",
        });
      }
    });
  });
  
  // Sửa thông tin user theo Id
  router.put("/:id", (req, res) => {
    // Lấy ra id
    const id = req.params.id;
    // Đọc file
    fs.readFile("./dev-data/posts.json", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        // Ép kiểu
        const posts = JSON.parse(data);
        // Kiểm tra user có tồn tại trong db?
        const getIndex = posts.findIndex((post) => post.id === +id);
        console.log(getIndex);
        // Nếu không tìm thấy
        if (getIndex === -1) {
          return res.status(404).json({
            status: "success",
            message: "post not found",
          });
        } else {
          posts[getIndex] = { ...posts[getIndex], ...req.body };
          fs.writeFileSync(
            "./dev-data/posts.json",
            JSON.stringify(posts),
            (err) => {
              if (err) throw err;
            }
          );
          return res.status(200).json({
            status: "success",
            message: "Updated successfully",
          });
        }
      }
      
    });
  });
  
  // Xóa thông tin một post theo Id
  router.delete("/:id", (req, res) => {
    // Lấy id được truyền vào
    const id = req.params.id;
    // ĐỌc file
    fs.readFile("./dev-data/posts.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const posts = JSON.parse(data);
        // Kiểm tra id có tồn tại trong db không?
        const isPostId = posts.find((post) => post.id === +id);
        if (!isPostId) {
          return res.status(404).json({
            status: "success",
            message: "post not found",
          });
        } else {
          const newPosts = posts.filter((post) => post.id !== +id);
          fs.writeFileSync("./dev-data/posts.json", JSON.stringify(newPosts));
          return res.status(200).json({
            status: "success",
            message: "Deleted successfully",
          });
        }
      }
    });
  });

  module.exports = router;