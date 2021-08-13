/** @format */

import React, { useState, useEffect } from 'react'

import { Form, Input, Button, notification, Spin, Row, Col, Card } from 'antd'

import { DeleteFilled, LikeOutlined } from '@ant-design/icons'

import moment from 'moment'
import 'moment/locale/es'

import { db } from '../../firebase'

import UsersComments from './services'

import './style.css'

const Coments = () => {
	const [notesForm] = Form.useForm()
	const dataBase = db.collection('comentarios')

	const [loading, setLoading] = useState(false)
	const [isData, setData] = useState(null)

	useEffect(() => {
		handleData()
	}, [])

	const handleData = () => {
		UsersComments().then((r) => {
			if (r) {
				setData(r)
			} else {
				setData(null)
			}
		})
	}

	const handleAddComment = async (i) => {
		setLoading(true)
		moment.locale('es')
		const date = firtsUppercase(moment(new Date()).format('LLLL'))

		const dataUser = {
			...i,
			fecha: date,
			likes: 0,
		}

		dataBase
			.add(dataUser)
			.then(() => {
				notification['success']({
					message: `Notificación`,
					description: `Su comentario ha sido agregado exitosamente.`,
				})
			})
			.catch(() => {
				notification['error']({
					message: `Aviso:`,
					description: `Ha ocurrido un error, intente más tarde`,
				})
			})
		await handleData()
		setLoading(false)
	}

	const handleDeleteComment = async (i) => {
		const query = await dataBase.get()

		const batch = db.batch()

		query.docs.forEach((item) => {
			if (item.id === i) {
				batch.delete(item.ref)
			}
		})

		batch.commit()

		notification['success']({
			message: `Notificación`,
			description: `Su comentario con ID: ${i} ha sido borrado exitosamente.`,
		})
		handleData()
	}

	const handleDeleteAllComments = async () => {
		const query = await dataBase.get()
		const batch = db.batch()

		query.docs.forEach((item) => batch.delete(item.ref))

		batch.commit()

		notification['success']({
			message: `Notificación`,
			description: `Todos sus comentarios han sido borrados exitosamente.`,
		})
		handleData()
	}

	const handleAddLikes = async (i) => {
		const like = dataBase.doc(i)

		const value = await like.get().then((r) => r.data().likes)

		like
			.update({
				likes: value + 1,
			})
			.then((r) => console.log(r))
			.catch((e) => console.log(e))
			.finally(() => handleData())
	}

	const firtsUppercase = (i) => {
		return i.charAt(0).toUpperCase() + i.slice(1)
	}

	return (
		<div className='container'>
			<h1>Formulario de Comentarios:</h1>
			<Form name='data_form' onFinish={handleAddComment} form={notesForm}>
				<h4>Nombre:</h4>
				<Form.Item
					name={'nombre'}
					rules={[
						{
							required: true,
							message: 'Campo obligatorio',
						},
					]}>
					<Input size='large' type='text' placeholder={'Nombre'} />
				</Form.Item>
				<br />
				<h4>Comentario:</h4>
				<Form.Item
					name={'comentario'}
					rules={[
						{
							required: true,
							message: 'Campo obligatorio',
						},
					]}>
					<Input size='large' type='text' placeholder={'Comentario'} />
				</Form.Item>
				<br />
				<Button type='primary' htmlType='submit' loading={loading}>
					Enviar
				</Button>
			</Form>
			<br />
			{isData ? (
				<>
					<h2>Comentarios:</h2>
					<Row>
						{isData.map((e, i) => (
							<Col span={8} key={i}>
								<Card size='small' title={e.nombre} style={{ margin: '5px' }}>
									<h4>{e.comentario}</h4>
									<h5>{e.fecha}</h5>
									<h4>Likes: ({e.likes})</h4>
									<div style={{ display: 'flex' }}>
										<Button
											type='primary'
											icon={<LikeOutlined />}
											size='small'
											onClick={() => handleAddLikes(e.id)}></Button>
										<div style={{ flexGrow: 1 }}></div>
										<Button
											type='primary'
											icon={<DeleteFilled />}
											size='small'
											onClick={() => handleDeleteComment(e.id)}></Button>
									</div>
								</Card>
							</Col>
						))}
					</Row>
					<br />
					<br />
					<Button onClick={() => handleDeleteAllComments()} type='primary' loading={loading}>
						Borrar Comentarios
					</Button>
				</>
			) : (
				<Spin />
			)}
		</div>
	)
}

export default Coments
