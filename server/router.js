const express = require('express');
const app = express();
const router = express.Router();
const client = require('./connection');

const db = client.db('task_binar');
const ObjectId = require('mongodb').ObjectId;

router.get('/api/user', async (req, res) => {
	try {
		// connect to database
		await client.connect();
		const user_game = await db.collection('user_game').find().toArray();
		if (user_game.length > 0) {
			res.status(200).json({
				message: 'Get List Users Successfully',
				status: 'success',
				data: user_game,
			});
		} else {
			res.status(200).json({
				message: 'No Users List Found',
				status: 'success',
				data: user_game,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
			status: 'error',
			data: error,
		});
	} finally {
		// untuk menutup koneksi (disconnect) dari database
		await client.close();
	}
});

router.get('/api/user/:id', async (req, res) => {
	try {
		// untuk connect ke database
		await client.connect();
		const user = await db
			.collection('user_game')
			.findOne({ _id: ObjectId(req.params.id) });
		if (user) {
			res.status(200).json({
				message: 'Get user_game Successfully',
				status: 'success',
				data: user,
			});
		} else {
			res.status(200).json({
				message: 'User Not Found',
				status: 'success',
				data: user,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal Server Error',
			status: 'error',
			data: error,
		});
	} finally {
		// untuk menutup koneksi (disconnect) dari database
		await client.close();
	}
});

router.post('/api/user', async (req, res) => {
	try {
		await client.connect();

		const newDocument = {
			uname: req.body.uname,
			password: req.body.password,
		};
		const result = await db.collection('user_game').insertOne(newDocument);
		if (result.acknowledged === true) {
			res.status(201).json({
				message: 'Create new user succes',
				status: 'success',
				data: newDocument,
			});
		} else {
			res.status(500).json({
				message: 'Internal server error',
				status: 'failed',
				data: result,
			});
		}
	} catch (error) {
		res.status(500).json({
			message: 'Internal server error',
			status: 'error',
			data: error,
		});
	} finally {
		await client.close();
	}
});

router.put('/api/user/:id', async (req, res) => {
	try {
		if (!req.params.id) {
			res.status(400).json({
				message: 'User Failed to Update, Please Insert ID',
				status: 'fail',
			});
		} else {
			await client.connect();
			const { uname, password } = req.body;
			const result = await db.collection('user_game').updateOne(
				{
					// wajib dikasih object id supaya bisa nemuin data dengan ID yang sesuai di collection nya
					_id: ObjectId(req.params.id),
				},
				{
					// method set untuk mengupdate data
					$set: {
						uname: uname,
						password: password,
					},
				}
			);
			if (result.modifiedCount > 0) {
				res.status(201).json({
					message: 'User Updated Successfully',
					status: 'success',
				});
			} else {
				res.status(500).json({
					message: 'User Failed to Update',
					status: 'fail',
				});
			}
		}
	} catch (error) {
		res.status(500).json(error);
	} finally {
		await client.close();
	}
});

router.delete('/api/user', async (req, res) => {
	try {
		if (!req.query.id) {
			res.status(400).json({
				message: 'User Failed to Delete, Please Insert ID',
				status: 'fail',
			});
		} else {
			await client.connect();
			const result = await db.collection('user_game').deleteOne({
				_id: ObjectId(req.query.id),
			});
			if (result.deletedCount > 0) {
				res.status(201).json({
					message: 'User Deleted Successfully',
					status: 'success',
				});
			} else {
				res.status(500).json({
					message: 'User Failed to Delete',
					status: 'fail',
				});
			}
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: error.message });
	} finally {
		await client.close();
	}
});

module.exports = router;
