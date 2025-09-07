import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

export default app;
