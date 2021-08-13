/** @format */

import firebase from 'firebase/app'
import 'firebase/firestore'

const fbConfig = {
	apiKey: 'AIzaSyCkL-QAxbF2xQMVU74F-wYegQfeCJpo4hg',
	authDomain: 'comentarios-test-bbf07.firebaseapp.com',
	projectId: 'comentarios-test-bbf07',
	storageBucket: 'comentarios-test-bbf07.appspot.com',
	messagingSenderId: '237018053462',
	appId: '1:237018053462:web:cfa69b63d9bc72a32d74f7',
}

firebase.initializeApp(fbConfig)

export const db = firebase.firestore()
