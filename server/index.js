const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const port = process.env.PORT || 8000
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
// middleware
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token
    console.log(token)
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.user = decoded
        next()
    })
}

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
})
async function run() {
    try {
        //DB collection
        const usersCollection = client.db("recipeHub").collection("users");
        const recipeCollection = client.db("recipeHub").collection("recipes");
        // auth related api
        app.post('/jwt', async (req, res) => {
            const user = req.body
            console.log('I need a new jwt', user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '365d',
            })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                })
                .send({ success: true })
        })

        // Logout
        app.get('/logout', async (req, res) => {
            try {
                res
                    .clearCookie('token', {
                        maxAge: 0,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                    })
                    .send({ success: true })
                console.log('Logout successful')
            } catch (err) {
                res.status(500).send(err)
            }
        })

        // Save or modify user email, status in DB
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const query = { email: email }
            const options = { upsert: true }
            const isExist = await usersCollection.findOne(query)
            console.log('User found?----->', isExist)
            if (isExist) return res.send(isExist)
            const result = await usersCollection.updateOne(
                query,
                {
                    $set: { ...user },
                },
                options
            )
            res.send(result)
        })
        // Get user by email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const result = await usersCollection.findOne({ email })
            res.send(result)
        })
        // Get all users 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find({}).toArray()
            res.send(result)
        })
        // save recipe to database
        app.post('/recipes', verifyToken, async (req, res) => {
            const recipe = req.body
            const result = await recipeCollection.insertOne(recipe)
            res.send(result)
        })
        //Get all recipes
        app.get('/recipes', async (req, res) => {
            const result = await recipeCollection.find({}).toArray()
            res.send(result)
        })
        //Get single recipe by id
        app.get('/recipes/:id', async (req, res) => {
            const id = req.params.id
            const result = await recipeCollection.findOne({ _id: new ObjectId(id) })
            res.send(result)
        })
        // update recipe
        app.put('/recipes/:id', verifyToken, async (req, res) => {
            const id = req.params.id;
            const updatedRecipe = req.body;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: updatedRecipe,
            };
            try {
                const result = await recipeCollection.updateOne(query, updateDoc);
                res.send(result);
            } catch (error) {
                console.error('Error updating recipe:', error);
                res.status(500).send({ message: 'Failed to update recipe' });
            }
        });
        // Update like status of a recipe
        app.patch('/recipes/:id/like', async (req, res) => {
            const id = req.params.id;
            const { liked } = req.body;
            const query = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: { liked: liked }
            };
            try {
                const result = await recipeCollection.updateOne(query, updateDoc);
                res.send(result);
            } catch (error) {
                console.error('Error updating like status:', error);
                res.status(500).send({ message: 'Failed to update like status' });
            }
        });


        // Generate client secret for stripe payment
        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body
            const amount = parseInt(price * 100)
            if (!price || amount < 1) return
            const { client_secret } = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],
            })
            res.send({ clientSecret: client_secret })
        })

        // Update user coin
        app.patch('/users/coin/:email', async (req, res) => {
            const email = req.params.email
            const coin = req.body.coin
            const query = { email: email }
            const updateDoc = {
                $set: {
                    coin: coin,
                },
            }
            const result = await usersCollection.updateOne(query, updateDoc)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db('admin').command({ ping: 1 })
        console.log(
            'Pinged your deployment. You successfully connected to MongoDB!'
        )
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from recipeHub Server..')
})

app.listen(port, () => {
    console.log(`RecipeHub is running on port ${port}`)
})