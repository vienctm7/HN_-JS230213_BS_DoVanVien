const express = require("express");
const router = express.Router();

const fs = require("fs");

// API lấy thông tin một user theo Id
router.get("/:id", (req, res) => {
    // La Id tu param
    const id = req.params.id;
    console.log(id);
    // Read file
    fs.readFile("./dev-data/users.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const users = JSON.parse(data);
        const user = users.find((el) => el.id === +id);
        if (user) {
          return res.status(200).json({
            status: "success",
            data: user,
          });
        } else {
          return res.status(404).json({
            status: "success",
            message: "User not found",
          });
        }
      }
    });
  });
  
  // API lấy thông tin của tất cả user
  router.get("/", (req, res) => {
    // Read file
    fs.readFile("./dev-data/users.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const users = JSON.parse(data);
        return res.status(200).json({
          status: "success",
          results: users.length,
          data: users,
        });
      }
    });
  });
  
  
  // checkExits
  const checkExits = (req, res, next) => {
    console.log("check");
    // Đọc file
    fs.readFile("./dev-data/users.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const users = JSON.parse(data);
        const isEmail = users.find((user) => user.email === req.body.email);
        if (isEmail) {
          return res.status(400).json({
            message: "Email đã tồn tại",
          });
        }
        next();
      }
    });
  };
  
  // Thêm mới một user
  router.post("/",  (req, res) => {
    // Lấy dữ liệu từ phần body
    const { name, username, email, phone, website } = req.body;
  
    // ĐỌc file
    fs.readFile("./dev-data/users.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const users = JSON.parse(data);
        const id = users[users.length - 1].id + 1;
        console.log(id);
        const newUser = {
               id: id,
          name: name,
          username: username,
          email: email,
          address: {
              street: null,
              suite: null,
              city: null,
              zipcode: null,
              geo: {
                  lat: null,
                  lng: null
              }
          },
          phone: phone,
          website: website,
          company: {
              name: null,
              catchPhrase: null,
              bs: null
          }
        };
        // Thêm vào db
        users.push(newUser);
        fs.writeFileSync("./dev-data/users.json", JSON.stringify(users));
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
    fs.readFile("./dev-data/users.json", "utf-8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        // Ép kiểu
        const users = JSON.parse(data);
        // Kiểm tra user có tồn tại trong db?
        const getIndex = users.findIndex((user) => user.id === +id);
        console.log(getIndex);
        // Nếu không tìm thấy
        if (getIndex === -1) {
          return res.status(404).json({
            status: "success",
            message: "User not found",
          });
        } else {
          users[getIndex] = { ...users[getIndex], ...req.body };
          fs.writeFileSync(
            "./dev-data/users.json",
            JSON.stringify(users),
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
  
  // Xóa thông tin một user theo Id
  router.delete("/:id", (req, res) => {
    // Lấy id được truyền vào
    const id = req.params.id;
    // ĐỌc file
    fs.readFile("./dev-data/users.json", "utf8", (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      } else {
        const users = JSON.parse(data);
        // Kiểm tra id có tồn tại trong db không?
        const isUserId = users.find((user) => user.id === +id);
        if (!isUserId) {
          return res.status(404).json({
            status: "success",
            message: "User not found",
          });
        } else {
          const newUsers = users.filter((user) => user.id !== +id);
          fs.writeFileSync("./dev-data/users.json", JSON.stringify(newUsers));
          return res.status(200).json({
            status: "success",
            message: "Deleted successfully",
          });
        }
      }
    });
  });

  module.exports = router;