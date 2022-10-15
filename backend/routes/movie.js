const express = require("express");
const path = require("path");
const pool = require("../config");
const fs = require("fs");
const multer = require("multer");
const Joi = require("joi");
const bcrypt = require('bcrypt');

router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './static/uploads')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '-' + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })


const signupSchema = Joi.object({
  m_name: Joi.string().required().min(3).max(150),
  release_date: Joi.string().required(),
  director: Joi.string().required().max(150),
  actor: Joi.string().required().max(150),
  plot: Joi.string().required().max(150),
})

const updateSchema = Joi.object({
  m_name: Joi.string().required().min(3).max(150),
  release_date: Joi.string().required(),
  director: Joi.string().required().max(150),
  actor: Joi.string().required().max(150),
  plot: Joi.string().required().max(150),
  image: Joi.alternatives().try(Joi.object(), Joi.string()),
})

const signupSchema3 = Joi.object({
  addshowdate: Joi.string().required(),
  add_st_time: Joi.string().required(),
  add_end_time: Joi.string().required(),
  addlanguage: Joi.string().required(),
  addtheatre: Joi.string().required(),
  m_id: Joi.string().required(),
})


router.get('/detail/:id', async function (req, res, next) {
  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [row, field] = await conn.query("select * from movies left outer join project_database.show on THEATRE_MOVIE_MOVIES_m_id = m_id left outer join theatre on tid = THEATRE_MOVIE_THEATRE_tid where m_id = ?",
      [req.params.id])
    let [theatre, field2] = await conn.query("select tid,hall_no,tname,location from movies join theatre_movie on m_id = MOVIES_m_id join theatre on THEATRE_tid = tid where m_id = ?",
      [req.params.id])
    let [date, field3] = await conn.query("select distinct show_date from movies join project_database.show on m_id = THEATRE_MOVIE_MOVIES_m_id where m_id = ?",
      [req.params.id])

    await conn.commit()
    res.json({ movie: row, theatre: theatre, date: date })

  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally");
    conn.release();
  }
})

router.get('/show/:showid', async function (req, res, next) {
  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [theatre, field] = await conn.query('select * from project_database.show join movies on m_id = THEATRE_MOVIE_MOVIES_m_id where show_id = ?',
      [req.params.showid])

    tid = theatre[0].THEATRE_MOVIE_THEATRE_tid

    let [seat, field2] = await conn.query('select * from seat where THEATRE_tid = ?',
      [tid])

    await conn.commit()
    res.json({ seat: seat, theatre: tid, detail: theatre })

  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally seat");
    conn.release();
  }
})

router.post('/createmovie', upload.single('image'), async function (req, res, next) {
  try {
    await signupSchema.validateAsync(req.body, { abortEarly: false })
  } catch (err) {
    return res.status(400).send(err)
  }
  const file = req.file

  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [row, field] = await conn.query('insert into movies(m_name, release_date, director, actors, img_movie, plot) values(?, ?, ?, ?, ?, ?)',
      [req.body.m_name, req.body.release_date, req.body.director, req.body.actor, file.path.substring(6), req.body.plot])

    await conn.commit()
    res.json()

  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally ticket");
    conn.release();
  }
})

router.get('/getticket/:showid', async function (req, res, next) {
  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    let [ticket, field] = await conn.query('select * from tickets where SHOW_show_id = ?',
      [req.params.showid])

    await conn.commit()
    res.json(ticket)

  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally ticket");
    conn.release();
  }
})
router.put('/updatedetail/:m_id', upload.single('image'), async function (req, res, next) {

  try {
    console.log(req.body)
    await updateSchema.validateAsync(req.body, { abortEarly: false })
  } catch (err) {
    return res.status(400).send(err)
  }

  let file = req.file
  if (!file) {
    var img = req.body.image
  }
  else {
    var img = file.path.substring(6)
  }

  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    const [rows, fields] = await pool.query(
      'UPDATE movies set m_name=?, release_date=?, director=?, actors=?, img_movie=?, plot=? where m_id=?',
      [req.body.m_name, req.body.release_date, req.body.director, req.body.actor, img, req.body.plot, req.params.m_id])

    await conn.commit()
    res.json()
  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally updatedetail");
    conn.release();
  }
});

router.post('/addshowtime', async function (req, res, next) {
  try {
    await signupSchema3.validateAsync(req.body, { abortEarly: false })
  } catch (err) {
    return res.status(400).send(err)
  }
  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {
    console.log(req.body)
    let [row, field] = await conn.query('SELECT * FROM project_database.theatre_movie where MOVIES_m_id = ? and THEATRE_tid = ?',
      [req.body.m_id, req.body.addtheatre])

    if (row.length == 0) {
      let [row2, field2] = await conn.query('insert into theatre_movie(MOVIES_m_id,THEATRE_tid) values(?, ?)',
        [req.body.m_id, req.body.addtheatre])
    }

    let [row3, field3] = await conn.query('insert into project_database.show(show_date, st_time, end_time, language, THEATRE_MOVIE_MOVIES_m_id, THEATRE_MOVIE_THEATRE_tid) values(?, ?, ?, ?, ?, ?)',
      [req.body.addshowdate, req.body.add_st_time, req.body.add_end_time, req.body.addlanguage, req.body.m_id, req.body.addtheatre])


    await conn.commit()
    res.json()

  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally addshowtime");
    conn.release();
  }
});

router.put('/deleteshow', async function (req, res, next) {
  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {

    let [row, field] = await conn.query('delete from project_database.show where show_id = ?',
      [req.body.showid])

    await conn.commit()
    res.json()

  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally deleteshow");
    conn.release();
  }
});
router.put('/deletemovie', async function (req, res, next) {
  const conn = await pool.getConnection();
  // Begin transaction
  await conn.beginTransaction();
  try {

    let [orderid] = await conn.query('select distinct ORDER_ITEM_ORDER_order_id from tickets where SHOW_show_id in ' +
      '(SELECT show_id FROM project_database.show where THEATRE_MOVIE_MOVIES_m_id = ?)',
      [req.body.m_id])

    orderid.forEach(async element => {
      console.log(element)
      await conn.query('delete from project_database.tickets where ORDER_ITEM_ORDER_order_id = ?',
        [element.ORDER_ITEM_ORDER_order_id])
      await conn.query('delete from order_item where ORDER_order_id = ?',
        [element.ORDER_ITEM_ORDER_order_id])
      await conn.query('delete from project_database.order where order_id = ?',
        [element.ORDER_ITEM_ORDER_order_id])
    });

    await conn.query('delete from project_database.show where THEATRE_MOVIE_MOVIES_m_id = ?',
      [req.body.m_id])

    await conn.query('delete from project_database.theatre_movie where MOVIES_m_id = ?',
      [req.body.m_id])

    await conn.query('delete from project_database.movies where m_id = ?',
      [req.body.m_id])

    await conn.commit()
    res.json()

  } catch (err) {
    await conn.rollback();
    return res.status(500).json(err);
  } finally {
    console.log("finally deletemovie");
    conn.release();
  }
});

exports.router = router;
