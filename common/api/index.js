import * as files from "./files"
import * as history from "./history"
import * as projects from "./projects"

const DEV = process.env.NODE_ENV === "development"

const fetchAdmin = async token => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		return true
	}
	const response = await fetch(`/api/admin`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}

	return null
}

const fetchUser = async token => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		return "DEVELOPPEMENT_ADMIN"
	}
	const response = await fetch(`/api/user`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}

	return null
}

export default { projects, history, files, fetchAdmin, fetchUser }
