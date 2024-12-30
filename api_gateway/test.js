import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/test", (req,res) => {
    res.sendStatus(200);
})

app.get("/hello", (req,res) => {
    res.send("hello world\n");
})

app.listen(5050, () => {
    console.log("running on 5050")
})