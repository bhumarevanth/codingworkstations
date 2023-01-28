// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
const firebaseConfig = {
	apiKey: "AIzaSyBwC9Bp5NGS6gvHYesqm4NnKcUpAcmx3_o",
	authDomain: "coding-workstation-6c93c.firebaseapp.com",
	projectId: "coding-workstation-6c93c",
	storageBucket: "coding-workstation-6c93c.appspot.com",
	messagingSenderId: "87145508702",
	appId: "1:87145508702:web:2cf77a781b9859a40ce9cf",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
export { app, auth }
