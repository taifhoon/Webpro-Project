const express = require("express");
const path = require("path");
const pool = require("../config");
const fs = require("fs");
const multer = require("multer");

router = express.Router();

router.post('/createorder', async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
        // Add เป็น Customer ID = 1 ไว้แก้ด้วย
        let [order, field] = await conn.query('insert into project_database.order(order_date, order_seats, total_price, CUSTOMER_cid, payment) values(CURRENT_TIMESTAMP, ?, ?, ?, ?)',
            [req.body.seat, req.body.price, req.body.cid, "Incomplete"])

        req.body.listSeat.forEach(async (seat) => {

            let [order_item, field2] = await conn.query('insert into order_item(item_price, ORDER_order_id) values(?, ?)',
                [seat.price, order.insertId])

            let [ticket, field3] = await conn.query('insert into tickets(price, SHOW_show_id, ORDER_ITEM_item_no, ORDER_ITEM_ORDER_order_id, ADMIN_admin_id, SEAT_seat_id) values(?, ?, ?, ?, ?, ?)',
                [seat.price, req.body.showid, order_item.insertId, order.insertId, 1, seat.seat_id])
        });

        await conn.commit()
        res.json(order)

    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally createorder");
        conn.release();
    }
})


router.delete('/deleteorder/:orderid', async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {

        let [ticket, field3] = await conn.query('delete from tickets where ORDER_ITEM_ORDER_order_id = ?',
            [req.params.orderid])

        let [order_item, field2] = await conn.query('delete from order_item where ORDER_order_id = ?',
            [req.params.orderid])

        let [order, field] = await conn.query('delete from project_database.order where order_id = ?',
            [req.params.orderid])

        await conn.commit()
        res.json(order)

    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally deleteorder");
        conn.release();
    }
})

router.put('/confirmorder', async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
        let [order, field] = await conn.query('update project_database.order set payment = ? where order_id = ?',
            ['Complete', req.body.orderid])

        await conn.commit()
        res.json()

    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally confirmorder");
        conn.release();
    }
})

router.get('/customer/:cid', async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
        let [payment, field] = await conn.query('select * from project_database.order where CUSTOMER_cid = ?',
            [req.params.cid])

        let [movie, field2] = await conn.query('select distinct order_id, show_id, m_id, m_name, language, img_movie, st_time, order_seats, total_price, show_date, payment, tid, tname ' +
            'from project_database.order join tickets on order_id = ORDER_ITEM_ORDER_order_id join project_database.show on SHOW_show_id = show_id '+
            'join movies on THEATRE_MOVIE_MOVIES_m_id = m_id join theatre on THEATRE_MOVIE_THEATRE_tid = tid where CUSTOMER_cid = ?',
            [req.params.cid])

        await conn.commit()
        res.json({ payment: payment, movie: movie })

    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally get customer");
        conn.release();
    }
})

router.get('/orderticket/:orderid', async function (req, res, next) {
    const conn = await pool.getConnection();
    // Begin transaction
    await conn.beginTransaction();
    try {
        let [order, field] = await conn.query('select * from project_database.order where order_id = ?',
            [req.params.orderid])

            let [ticket, field2] = await conn.query('select * from tickets join project_database.show on show_id = SHOW_show_id join movies on m_id = THEATRE_MOVIE_MOVIES_m_id '+
            'join seat on seat_id = SEAT_seat_id join theatre on tid = THEATRE_MOVIE_THEATRE_tid where ORDER_ITEM_ORDER_order_id = ?',
            [req.params.orderid])

        await conn.commit()
        res.json({order: order ,ticket: ticket})

    } catch (err) {
        await conn.rollback();
        return res.status(500).json(err);
    } finally {
        console.log("finally get ticket");
        conn.release();
    }
})


exports.router = router;