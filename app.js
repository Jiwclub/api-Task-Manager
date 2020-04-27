const express = require("express");
const app = express();

const { mongoose } = require("./db/mongoose");

const bodyParser = require("body-parser");


// Load in the mongoose model
const { List, Task, User } = require("./db/models");

// Load middleware ตัวกลาง
app.use(bodyParser.json());
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};

app.use(cors);


// List Router
// app.get('/',(req,res)=>{
//   res.send("Hello")
// })

app.get("/lists", (req, res) => {
  //   ดึงข้อมูลที่มีใน database มาแสดง
  List.find({
    // _userId: req.user_id,
  }).then((lists) => {
    res.send(lists);
  });
  // .catch((e) => {
  //   res.send(e);
  // });
});

app.post("/lists", (req, res) => {
  // ส่งค่าแล้วเพิ่มข้อมูลลงใน database
  let title = req.body.title;

  let newList = new List({
    title,
    // _userId: req.user_id
  });
  newList.save().then((listDoc) => {
    // the full list document is returned (incl. id)
    res.send(listDoc);
  });
});

app.patch("/lists/:id", (req, res) => {
  // อัพเดตข้อมูล
  List.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "updated successfully" });
  });
});

app.delete("/lists/:id", (req, res) => {
  // ลบข้อมูล

  List.findOneAndRemove({
    _id: req.params.id,
  }).then((removdListDoc) => {
    res.send(removdListDoc);
  });
});

// api ส่วน task

app.get("/lists/:listId/tasks", (req, res) => {
  // We want to return all tasks that belong to a specific list (specified by listId)
  Task.find({
    _listId: req.params.listId,
  }).then((tasks) => {
    res.send(tasks);
  });
});

// เพิ่ม task
app.post("/lists/:listId/tasks", (req, res) => {
  let newTask = new Task({
    title: req.body.title,
    _listId: req.params.listId,
  });
  newTask.save().then((newTaskDoc) => {
    res.send(newTaskDoc);
  });
});

// อัพเดต tasks
app.patch("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndUpdate(
    {
      _id: req.params.taskId,
      _listId: req.params.listId,
    },
    {
      $set: req.body,
    }
  ).then(() => {
    res.send({ message: "Updated successfully." });
  });
});

// ลบข้อมูล Task
app.delete("/lists/:listId/tasks/:taskId", (req, res) => {
  Task.findOneAndRemove({
    _id: req.params.taskId,
    _listId: req.params.listId,
  }).then((removedTaskDoc) => {
    res.send(removedTaskDoc);
  });
});

app.listen(3000, () => {
  console.log("Sever is listening on port 3000");
});
