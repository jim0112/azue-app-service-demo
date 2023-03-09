import { Router } from "express"
import connect from "../src/db";
import Validiting from "../src/utils/validateToken";
const router = Router();
router.post("/insert", async (req, res) => {
    try{
        const date = req.body.date;
        const time = req.body.time;
        const action = req.body.action;
        const token = req.headers.authorization;
        if(Validiting(token)){
            await connect('i', date, time, action);
            res.send({message: 'insertion succeed'});
        }
        else{
            res.status(401).send({ message: "unauthorized" });
        }
    }
    catch (err){
        throw err;
    }
})

router.get("/schedule", async (req, res) => {
    try{
        const token = req.headers.authorization;
        if(Validiting(token))
        await connect('v', null, null, null, (err, data) => {
            if (err)
                throw new Error(err);
            res.send({ message: "view succeed", data: data });
        });
        else{
            res.status(401).send({ message: "unauthorized", data: []});
        }
    }
    catch (err){
        throw err;
    }
    
});

router.delete("/schedules", async (req, res) => {
    try{
        const token = req.headers.authorization;
        if(Validiting(token)){
            await connect('d', null, null, null);
            res.send({message: "delete all"});
        }
        else{
            res.status(401).send({ message: "unauthorized" });
        }
    }
    catch (err){
        throw err;
    }
})

export default router;