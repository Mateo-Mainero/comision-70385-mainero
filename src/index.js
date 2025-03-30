import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import path from 'path'
import { __dirname } from './path.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import {create} from 'express-handlebars'
import passport from 'passport'
import initalizatePassport from './config/passport.config.js'
import MongoStore from 'connect-mongo'
import indexRouter from './routes/index.routes.js'
import mongoose from 'mongoose'
import cors from 'cors'



const app = express()
const PORT = 5000
const hbs = create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
})
app.use(cors())
app.use(express.json())
app.use(cookieParser(process.env.SECRET_COOKIE)) 
const mongoUrl = process.env.URL_MONGO; 
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        mongoOptions: {},
        ttl: 15000000000
    }),
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true
}))

mongoose.connect(mongoUrl)
.then(() => console.log("DB is connected"))
.catch((e) => console.log("Error al conectarme a DB:", e))

initalizatePassport()
app.use(passport.initialize())
app.use(passport.session())
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views')) //Concateno evitando erroes de / o \
app.use(express.static(path.join(__dirname, "public")))
//Rutas
app.use('/', indexRouter)


app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})