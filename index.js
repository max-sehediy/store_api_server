require('dotenv').config()

const express = require('express')
const sequelize = require('./db')
const models = require('./api/models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./api/routes')
const errorHandler = require('./api/middleware/ErrorHandingMiddleware');
const path = require('path');


// 20b2d0a6-c734-4f4a-8d18-ab86de251de2.jpg

const PORT = process.env.PORT || 7000

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use('/api', router)

//! errors 
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (error) {
        console.log('error');
        console.log(error);
    }
}
start()