import express from 'express';
import cors from 'cors';
import routes from '../routes';
import path from "path";

const app = express();
if (process.env.NODE_ENV !== "producton")
    app.use(cors());
app.use(express.json());
app.use("/api", routes);
const port = process.env.PORT || 4000
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}
app.listen(port, () => 
    console.log(`app listening on port ${port}!`),
);