/** @format */

import { notification } from 'antd'

import { db } from '../../firebase'

const UsersComments = async () => {
	let response

	const data = db.collection('comentarios')

	await data
		.get()
		.then((r) => {
			if (r.docs.length > 0) {
				let a = []
				r.docs.map((item) => {
					return a.push({ ...item.data(), id: item.id })
				})
				response = a
			} else {
				notification['warning']({
					message: 'Aviso:',
					description: '¡Error, Registro no encontrado ó problemas con la consulta!.',
				})
			}
		})
		.catch(() => {
			notification['error']({
				message: 'Aviso:',
				description: '¡Revisa tu servicio de internet!.',
			})
		})
	return response
}
export default UsersComments
