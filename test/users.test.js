const UserModel = require("../models/user");
const supertest = require("supertest"),
  app = require("../app");
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectId;
const DepartmentModel = require("../models/department");

beforeEach((done) => {
  mongoose.connect(
    `mongodb://localhost:27017/${process.env.MONGODB_NAME}`,
    () => done()
  );
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

test("GET /users", async () => {
  const user = await new UserModel({
    name: "marc",
    email: "sabehmarc@gmail.com",
    phone_number: "71633732",
    seiority: "midlevel",
    title: "Full Stack dev",
    department_id: ObjectID(1),
    password: "123456",
    location: "Beirut",
  });
  user.save();

   supertest(app)
    .get("/users")
    .expect(200)
    .expect((res) => {
      let a = res.body.users[0];
      expect(a._id).toBe(user._id);
    });
});

test("POST /users/signup", async () => {
  const department = new DepartmentModel({
    department_name: "tech",
  });
  department.save();

  const data = {
    name: "marc",
    email: "sabehmarc1@gmail.com",
    phone_number: "71633732",
    seiority: "midlevel",
    title: "Full Stack dev",
    department_name: "tech",
    password: "123456",
    location: "Beirut",
  };

  await supertest(app)
    .post("/users/signup")
    .send(data)
    .expect(201)
    .expect((res) => {
      expect(res.body.message).toBe("Created User Successfully");
    });
});


test("POST /users/login", async () => {

    const user = await new UserModel({
        name: "marc",
        email: "sabehmarc11@gmail.com",
        phone_number: "71633732",
        seiority: "midlevel",
        title: "Full Stack dev",
        department_id: ObjectID(1),
        password: "123456",
        location: "Beirut",
      });
      await user.save();
    
  
    let data = {
      email: "sabehmarc11@gmail.com",
      password: "123456",
    };
  
    await supertest(app)
      .post("/users/login")
      .send(data)
      .expect((res) => {
        expect(res).toBe("Created User Successfully");
      });
  });
  
