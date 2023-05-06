const express = require("express");
const app = express.Router();
const { check, validationResult } = require("express-validator");
const db = require("../config/connectDB");
const bcrypt = require("bcrypt");
app.use(express.urlencoded());

const loginValidator = [
  check("email")
    .exists()
    .withMessage("Vui lòng nhập email người dùng")
    .notEmpty()
    .withMessage("Không được để trống email người dùng")
    .isEmail()
    .withMessage("Đây không phải là email hợp lệ"),

  check("password")
    .exists()
    .withMessage("Vui lòng nhập mật khẩu người dùng")
    .notEmpty()
    .withMessage("Không được để trống mật khẩu người dùng")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu người dùng phải từ 6 kí tự"),
];

const registerValidator = [
  check("name")
    .exists()
    .withMessage("Vui lòng nhập tên người dùng")
    .notEmpty()
    .withMessage("Không được để trống tên người dùng")
    .isLength({ min: 6 })
    .withMessage("Tên người dùng phải từ 6 kí tự"),

  check("email")
    .exists()
    .withMessage("Vui lòng nhập email người dùng")
    .notEmpty()
    .withMessage("Không được để trống email người dùng")
    .isEmail()
    .withMessage("Đây không phải là email hợp lệ"),

    check("name")
    .exists()
    .withMessage("Vui lòng nhập số điện thoại người dùng")
    .notEmpty()
    .withMessage("Không được để trống số điện thoại người dùng")
    .isLength({ min: 10 })
    .withMessage("Tên người dùng phải từ 10 số"),


  check("password")
    .exists()
    .withMessage("Vui lòng nhập mật khẩu người dùng")
    .notEmpty()
    .withMessage("Không được để trống mật khẩu người dùng")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu người dùng phải từ 6 kí tự"),

  check("confirmPassword")
    .exists()
    .withMessage("Vui lòng xác nhận mật khẩu")
    .notEmpty()
    .withMessage("Vui lòng nhập xác nhận mật khẩu")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Mật khẩu không khớp");
      }
      return true;
    }),
];

const changePasswordValidator = [
  check("currentPassword")
    .exists()
    .withMessage("Vui lòng nhập mật khẩu hiện tại")
    .notEmpty()
    .withMessage("Không được để trống mật khẩu hiện tại"),

  check("newPassword")
    .exists()
    .withMessage("Vui lòng nhập mật khẩu mới")
    .notEmpty()
    .withMessage("Không được để trống mật khẩu mới")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải từ 6 kí tự"),

  check("confirmPassword")
    .exists()
    .withMessage("Vui lòng xác nhận mật khẩu mới")
    .notEmpty()
    .withMessage("Vui lòng nhập xác nhận mật khẩu mới")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Mật khẩu mới không khớp");
      }
      return true;
    }),
];
const updateValidator = [
  check('name')
    .notEmpty()
    .withMessage("Không được để trống tên người dùng")
    .matches(/^([a-zA-Z]+\s[a-zA-Z]+)+$/)
    .withMessage("Tên người dùng phải chỉ chứa các ký tự chữ cái và khoảng trắng và phải có ít nhất 2 từ")
    .isLength({ min: 6 })
    .withMessage("Tên người dùng phải từ 6 kí tự"),

  check("phone")
    .notEmpty()
    .withMessage("Không được để trống số điện thoại người dùng")
    .isLength({ min: 10 })
    .withMessage("Số điện thoại phải từ 10 số"),
];

let getChangeProfile = (req, res) => {
  
  const error = req.flash("error") || "";
  const name = req.flash("name") || "";
  const phone = req.flash("phone") || "";

  res.render("change-profile", {error: error, name: name, phone: phone});
}

let postChangeProfile =(updateValidator,(req, res) =>{
  const result = validationResult(req);

  if (result.errors.length === 0) {
    const { name, phone } = req.body;
    const userId = req.session.user.id;
    

    // Kiểm tra nếu số điện thoại không đủ 10 số thì báo lỗi
    if (!/^0\d{9}$/.test(phone)) {
      req.flash("error", "Số điện thoại phải có đúng 10 số và bắt đầu bằng số không");
      req.flash("name", name);
      req.flash("phone", phone);
      return res.redirect("/account/change-profile");
    }

    const sql = "UPDATE account SET name=?, phone=? WHERE id=?";
    const params = [name, phone, userId];

    db.query(sql, params, (err, result, fields) => {
      if (err) {
        req.flash("error", err.message);
        req.flash("name", name);
        req.flash("phone", phone);

        return res.redirect("/account/change-profile");
      } else if (result.affectedRows === 1) {
        req.flash("success", "Cập nhật thông tin thành công");
        return res.redirect("/");
      } else {
        req.flash("error", "Cập nhật thông tin thất bại");
        req.flash("name", name);
        req.flash("phone", phone);

        return res.redirect("/account/change-profile");
      }
    });
  } else {
    const errors = result.mapped();

    for (const field in errors) {
      const message = errors[field].msg;
      req.flash(field, message);
    }

    return res.redirect("/account/change-profile");
  }
});

let getChangePassword = (req, res) => {
  const error = req.flash("error") || "";
  const password = req.flash("password") || "";
  res.render("change-password", { title: "Change Password", error: error, password: password });
}

let postChangePassword = (changePasswordValidator, (req, res) => {
  let result = validationResult(req);
    if (result.errors.length === 0) {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = req.session.user;
        const hashed = user.password;
        const match = bcrypt.compareSync(currentPassword, hashed);
        if (!match) {
          req.flash("error", "Mật khẩu hiện tại không chính xác");
          res.redirect("/account/change-password");
        }else if(newPassword !== confirmPassword){
          req.flash("error", "Mật khẩu mới không khớp");
          res.redirect("/account/change-password");
          return;
        } else {
          // Update new password
          const newHashed = bcrypt.hashSync(newPassword, 10);
          const sql = "UPDATE account SET password = ? WHERE id = ?";
          const params = [newHashed, user.id];
  
          db.query(sql, params, (err, results, fields) => {
            if (err) {
              req.flash("error", err.message);
              res.redirect("/account/change-password");
            } else {
              req.flash("success", "Đổi mật khẩu thành công");
              res.redirect("/");
            }
          });
        }
      // Check if current password is correct
    } else {
      result = result.mapped();
      console.log(result);

      let message;
      for (fields in result) {
        message = result[fields].msg;
        break;
      }

      req.flash("error", message);
      res.redirect("/account/change-password");
    }
});


let getLogout = (req, res) => {
  //req.session.user = null;
  req.session.destroy();
  res.redirect("/account/login");
};

let getLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }

  const error = req.flash("error") || "";
  const password = req.flash("password") || "";
  const email = req.flash("email") || "";

  res.render("login", { error, password, email });
};

let postLogin =
  (loginValidator,
  (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
      const { email, password } = req.body;

      const sql = "SELECT * FROM account WHERE email = ?";
      const params = [email];

      db.query(sql, params, (err, results, fields) => {
        if (err) {
          req.flash("error", err.message);
          req.flash("password", password);
          req.flash("email", email);
          res.redirect("/account/login");
        } else if (results.length === 0) {
          req.flash("error", "Email không tồn tại");
          req.flash("password", password);
          req.flash("email", email);
          res.redirect("/account/login");
        } else {
          const hashed = results[0].password;
          const match = bcrypt.compareSync(password, hashed);
          if (!match) {
            req.flash("error", "Mật khẩu không chính xác");
            req.flash("password", password);
            req.flash("email", email);
            res.redirect("/account/login");
          } else {
            //delete results[0].password
            req.session.user = results[0];
            return res.redirect("/");
            // return res.render('index',{email})
          }
        }
      });
    } else {
      result = result.mapped();
      console.log(result);

      let message;
      for (fields in result) {
        message = result[fields].msg;
        break;
      }
      const { email, password } = req.body;

      req.flash("error", message);
      req.flash("password", password);
      req.flash("email", email);

      res.redirect("/account/login");
    }
  });

let getRegister = (req, res) => {
  const error = req.flash("error") || "";
  const name = req.flash("name") || "";
  const email = req.flash("email") || "";
  const phone = req.flash("phone") || "";

  res.render("register", { error: error, name: name, email: email, phone: phone });
};
let postRegister =
  (registerValidator,
  (req, res) => {
    let result = validationResult(req);

    if (result.errors.length === 0) {
      const { name, email,phone, password } = req.body;
      if (!/^0\d{9}$/.test(phone)) {
        req.flash("error", "Số điện thoại phải có đúng 10 số và bắt đầu bằng số không");
        req.flash("name", name);
        req.flash("phone", phone);
        return res.redirect("/account/register");
      }
      const hashed = bcrypt.hashSync(password, 10);

      const sql = "insert into account(name, email,phone, password) values(?,?,?,?)";
      const params = [name, email,phone, hashed];

      db.query(sql, params, (err, result, fields) => {
        if (err) {
          req.flash("error", err.message);
          req.flash("name", name);
          req.flash("email", email);
          req.flash("phone", phone);

          return res.redirect("/account/register");
        } else if (result.affectedRows === 1) {
          req.flash("success", "Đăng kí thành công");
          return res.redirect("/account/login");
        } else {
          req.flash("error", "Đăng kí thất bại");
          req.flash("name", name);
          req.flash("email", email);
          req.flash("phone", phone);

          return res.redirect("/account/register");
        }
      });
    } else {
      result = result.mapped();
      console.log(result);

      let message;
      for (fields in result) {
        message = result[fields].msg;
        break;
      }
      const { name, email,phone, password } = req.body;

      req.flash("error", message);
      req.flash("name", name);
      req.flash("email", email);
      req.flash("phone", phone);

      res.redirect("/account/register");
    }
  });

module.exports = {
  getLogin: getLogin,
  getLogout: getLogout,
  postLogin: postLogin,
  getRegister: getRegister,
  postRegister: postRegister,
  postChangePassword: postChangePassword,
  getChangePassword : getChangePassword,
  postChangeProfile : postChangeProfile,
  getChangeProfile : getChangeProfile,
};  