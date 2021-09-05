const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");
const DepartmentModel = require("../models/department");
const crypto = require("crypto");
var ObjectId = require('mongoose').Types.ObjectId; 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    let fileArr = file.originalname.split(".");
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        crypto.createHash("md5").update(fileArr[0]).digest("hex") +
        "." +
        fileArr[1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

/* GET all users */
router.get("/", function (req, res, next) {
  console.log(req.query);
  const limit = parseInt(req.query.limit); // Make sure to parse the limit to number
  const skip = parseInt(req.query.skip);
    if(req.query.filterBy && req.query.filterByValue)
        {
          if(req.query.filterBy === "department_id") {
            UserModel.find({ [req.query.filterBy] :  new mongoose.Types.ObjectId(req.query.filterByValue) })
            .skip(skip) 
            .limit(limit) 
              .select(
                "_id name email title seiority department_id picture phone_number location"
              )
              .populate("department_id", "_id department_name")
              .exec()
              .then((docs) => {

                const response = {
                  count: docs.length,
                  users: docs.map((doc) => {
                    return {
                      _id: doc._id,
                      name: doc.name,
                      email: doc.email,
                      title: doc.title,
                      seiority: doc.seiority,
                      department_name: doc.department_id,
                      picture: `http://localhost:3000/uploads/${doc.picture}`,
                      phone_number: doc.phone_number,
                      location: doc.location,
                      request: {
                        type: "GET",
                        url: `http://localhost:3000/users/${doc._id}`,
                      },
                    };
                  }),
                };
                res.status(200).json(response);
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({ error: err });
              });
          }
          else {
    UserModel.find({ [req.query.filterBy] : new RegExp(req.query.filterByValue)  })
    .skip(skip) 
    .limit(limit) 
    .select(
      "_id name email title seiority department_id picture phone_number location"
    )
    .populate("department_id", "_id department_name")
    .exec()
    .then((docs) => {

      const response = {
        count: docs.length,
        users: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            email: doc.email,
            title: doc.title,
            seiority: doc.seiority,
            department_name: doc.department_id,
            picture: `http://localhost:3000/uploads/${doc.picture}`,
            phone_number: doc.phone_number,
            location: doc.location,
            request: {
              type: "GET",
              url: `http://localhost:3000/users/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
        }
      }
        else {


  UserModel.find()
    .skip(skip) 
    .limit(limit) 
    .select(
      "_id name email title seiority department_id picture phone_number location"
    )
    .populate("department_id", "_id department_name")
    .exec()
    
    .then((docs) => {
      const response = {
        count: docs.length,
        users: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            email: doc.email,
            title: doc.title,
            seiority: doc.seiority,
            department_name: doc.department_id,
            picture: `http://localhost:3000/uploads/${doc.picture}`,
            phone_number: doc.phone_number,
            location: doc.location,
            request: {
              type: "GET",
              url: `http://localhost:3000/users/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}
});

router.post("/signup", upload.single("picture"), (req, res, next) => {
  DepartmentModel.find({ department_name: req.body.department_name })
    .exec()
    .then((dep) => {
      if (dep.length !== 1) {
        return res.status(404).json({
          message: "Department Not found",
        });
      } else {
        UserModel.find({ email: req.body.email })
          .populate("department_id", "_id department_name")
          .exec()
          .then((user) => {
            if (user.length >= 1) {
              return res.status(409).json({
                message: "Mail Exsits",
              });
            } else {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error: err,
                  });
                } else {
                  console.log(req.file);
                  const user = new UserModel({
                    name: req.body.name,
                    email: req.body.email,
                    picture: req.file ? req.file.filename : "",
                    phone_number: req.body.phone_number,
                    seiority: req.body.seiority,
                    title: req.body.title,
                    department_id: dep[0]._id,
                    password: hash,
                    location: req.body.location,
                  });
                  user
                    .save()
                    .then((result) => {
                      console.log(result);
                      const token = jwt.sign(
                        {
                          email: result.email,
                          userId: result._id,
                        },
                        "secret",
                        {
                          expiresIn: "1h",
                        }
                      );
                      return res.status(201).json({
                        message: "Created User Successfully",
                        token: token,
                        user: {
                          _id: result._id,
                          name: result.name,
                          email: result.email,
                          title: result.title,
                          seiority: result.seiority,
                          department_name: result.department_id,
                          picture: `http://localhost:3000/uploads/${result.picture}`,
                          phone_number: result.phone_number,
                          location: result.location,
                        },
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(500).json({
                        error: err,
                      });
                    });
                }
              });
            }
          });
      }
    });
});

router.post("/login", (req, res, next) => {
  UserModel.find({ email: req.body.email })
    .populate("department_id", "_id department_name")
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "secret",
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth Successful",
            token: token,
            user: user.map((doc) => {
              return {
                _id: doc._id,
                name: doc.name,
                email: doc.email,
                title: doc.title,
                seiority: doc.seiority,
                department_name: doc.department_id,
                picture: `http://localhost:3000/uploads/${doc.picture}`,
                phone_number: doc.phone_number,
                location: doc.location,
              };
            }),
          });
        }
        res.status(401).json({
          message: "Auth Failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

/* GET me user from token */
router.get("/me", checkAuth, function (req, res, next) {
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization.split(" ")[1],
      decoded;
    try {
      decoded = jwt.verify(authorization, process.env.JWT_KEY);
    } catch (e) {
      return res.status(401).send("unauthorized");
    }
    var userId = decoded.userId;
    // Fetch the user by id
    UserModel.findById({ _id: userId })
      .populate("department_id", "_id department_name")
      .then((user) => {
        return res.json(user);
      });
  }
});

router.delete("/:userId", checkAuth, (req, res) => {
  const id = req.params.userId;

  UserModel.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/* GET one user */
router.get("/:userId", function (req, res, next) {
  const id = req.params.userId;

  UserModel.find({ _id: id })
    .select("_id name email title seiority department_id picture phone_number")
    .exec()
    .then((docs) => {
      const response = {
        user: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            email: doc.email,
            title: doc.title,
            seiority: doc.seiority,
            department_id: doc.department_id,
            picture: doc.picture,
            phone_number: doc.phone_number,
            location: doc.location,
            request: {
              type: "GET",
              url: `http://localhost:3000/users/${doc._id}`,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
