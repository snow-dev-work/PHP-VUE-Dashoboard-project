const DEV = process.env.NODE_ENV === "development"

export const post = async (token, project_id, data) => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		return data
	}
	const response = await fetch(`/api/projects/${project_id}/history`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}
}

export const put = async (token, project_id, id, data) => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		return { ...data, id }
	}
	const response = await fetch(`/api/projects/${project_id}/history/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}

	return null
}

export const remove = async (token, project_id, id) => {
	if (DEV) {
		await new Promise(resolve => setTimeout(resolve, 1500))
		return { id }
	}
	const response = await fetch(`/api/projects/${project_id}/history/${id}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	})

	if (response.ok) {
		return await response.json()
	}

	return null
}
