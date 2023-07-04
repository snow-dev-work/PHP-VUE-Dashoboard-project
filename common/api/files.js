const DEV = process.env.NODE_ENV === "development"

export const fetchAll = async token => {
	if (DEV) {
		const today = new Date()
		const YEAR = today.getFullYear()
		const MONTH =
			today.getMonth() < 10 ? `0${today.getMonth()}` : `${today.getMonth()}`
		const DAY =
			today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`
		const HOURS =
			today.getHours() < 10 ? `0${today.getHours()}` : `${today.getHours()}`
		const MINUTES =
			today.getMinutes() < 10
				? `0${today.getMinutes()}`
				: `${today.getMinutes()}`

		await new Promise(resolve => setTimeout(resolve, 1500))
		return [
			{
				id: 1,
				project_id: 1,
				date: `${YEAR}-${MONTH}-${DAY} ${HOURS}:${MINUTES}`,
				description: "Test\nDescription",
				filename: "test.word",
				path: "*",
			},
		]
	}
	const response = await fetch("/files", {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}

	return []
}

export const post = async (token, data) => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		console.table([...data])
		return null
	}

	const response = await fetch("/files", {
		method: "POST",
		body: data,
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}

	return null
}

export const remove = async (token, id) => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		return { id }
	}

	const response = await fetch(`/files/${id}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}

	return null
}

export const download = async (token, id) => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		return { id }
	}

	const response = await fetch(`/files/${id}`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.blob()
	}

	return null
}
