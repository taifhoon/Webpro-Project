const express = require("express")
const pool = require("../config")
const Joi = require('joi')
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/token");
const { isLoggedIn } = require('../middlewares');
const e = require("express");

router = express.Router();

const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}

const emailValidator = async (value, helpers) => {
    const [rows, _] = await pool.query("SELECT email_id FROM customer WHERE email_id = ?", [value])
    if (rows.length > 0) {
        const message = 'This email is already taken'
        throw new Joi.ValidationError(message, { message })
    }
    return value
}

const signupSchema = Joi.object({
    email: Joi.string().required().email().external(emailValidator),
    mobile: Joi.string().required().pattern(/0[0-9]{9}/),
    password: Joi.string().required().custom(passwordValidator),
    confirm_password: Joi.string().required().valid(Joi.ref('password')),
    c_name: Joi.string().required().min(3).max(20),
})

const changepassSchema = Joi.object({
    cid:Joi.string().required(),
    password: Joi.string().required(),
    newpass: Joi.string().required(),
    confirmnewpass: Joi.string().required(),
})


router.post('/user/signup', async (req, res, next) => {
    try {
        await signupSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    const c_name = req.body.c_name
    const password = req.body.password
    const email = req.body.email
    const mobile = req.body.mobile

    try {
        await conn.query(
            'INSERT INTO customer(c_name, password, email_id, phone_no) VALUES (?, ?, ?, ?)',
            [c_name, password, email, mobile]
        )
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})
const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})

router.post('/user/login', async (req, res, next) => {
    try {
        await loginSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        return res.status(400).send(err)
    }
    const email = req.body.email
    const password = req.body.password

    const conn = await pool.getConnection()
    await conn.beginTransaction()

    try {
        // Check if username is correct
        const [users] = await conn.query(
            'SELECT * FROM customer WHERE email_id = ?',
            [email]
        )
        const [admins] = await conn.query(
            'select * from admin where admin_name = ?',
            [email]
        )
        const user = users[0]
        const admin = admins[0]
        var haveuser
        if (!user && !admin) {
            throw new Error('Incorrect Email or password - No Email / Not Admin')
        }
        else if (!admin) {
            haveuser = user
            haveuser.id = user.cid
            haveuser.role = 'user'
        }
        else if (!user) {
            haveuser = admin
            haveuser.id = admin.admin_id
            haveuser.role = 'admin'
        }

        // Check if password is correct
        if (!(password == haveuser.password)) {
            throw new Error('Incorrect Email or password - Password')
        }

        // Check if token already existed
        if (haveuser.role == 'user') {
            var [tokens] = await conn.query(
                'SELECT * FROM customer_tokens WHERE user_id = ?',
                [haveuser.id]
            )
        }
        else if(haveuser.role == 'admin'){
            var [tokens] = await conn.query(
                'SELECT * FROM admin_tokens WHERE admin_id = ?',
                [haveuser.id]
            )
        }


        let token = tokens[0]?.token
        if (!token) {
            // Generate and save token into database
            token = generateToken()

            if (haveuser.role == 'user') {
                await conn.query(
                    'INSERT INTO customer_tokens(user_id, token) VALUES (?, ?)',
                    [haveuser.id, token]
                )
            }
            else if(haveuser.role == 'admin'){
                await conn.query(
                    'INSERT INTO admin_tokens(admin_id, token) VALUES (?, ?)',
                    [haveuser.id, token]
                )
            }
        }


        conn.commit()
        res.status(200).json({ 'token': token })
    } catch (error) {
        conn.rollback()
        res.status(400).json(error.toString())
    } finally {
        conn.release()
    }
})

router.get('/user/me', isLoggedIn, async (req, res, next) => {
    // req.user ถูก save ข้อมูล user จาก database ใน middleware function "isLoggedIn"
    res.json(req.user)
})


router.put('/changepass', async (req, res, next) => {
    // try {
    //     await changepassSchema.validateAsync(req.body, { abortEarly: false })
    // } catch (err) {
    //     return res.status(400).send(err)
    // }

    const conn = await pool.getConnection()
    await conn.beginTransaction()
    
    const password = req.body.password
    const newpass = req.body.newpass
    const cid = req.body.cid

    try {
        let [user] = await conn.query(
            'select * from customer where cid = ?',
            [cid]
        )
        const real_password = user[0].password
         if(password == real_password){
             console.log('correct')
             await conn.query('update customer set password = ? where cid = ?',
             [newpass, cid])
         }
         else{
            throw new Error('Incorrect password')
         }
        conn.commit()
        res.status(200).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

exports.router = router