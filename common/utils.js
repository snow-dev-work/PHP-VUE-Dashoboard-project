export const randomIntInclusive = function (min = 0, max = 1) {
	let [a, b] = [min, max]

	if (a > b) {
		let [b, a] = [a, b]
		b = Math.ceil(b)
		a = Math.floor(a)
	} else {
		a = Math.ceil(a)
		b = Math.floor(b)
	}

	return Math.floor(Math.random() * (b - a + 1)) + a
}

const chars = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
]
export const randomChar = function (space = [...chars]) {
	return space[randomIntInclusive(0, space.length - 1)]
}

export const getUuidGenerator = function* (prefix = "") {
	const ids = []
	let id

	do {
		id = `${prefix}-`

		for (let i = 0; i < 8; i++) {
			id += randomChar()
		}

		id += "-"
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				id += randomChar()
			}
			id += "-"
		}

		for (let i = 0; i < 12; i++) {
			id += randomChar()
		}

		yield id
	} while (!ids.includes(id))
}

export const counter = function* () {
	let count = 0
	while (true) {
		yield ++count
	}
}

export const scrollToProject = ({ id }) => {
	window.setTimeout(() => {
		const project = document.getElementById(`project-${id}`)
		let { top = 0 } = project?.getBoundingClientRect?.() ?? {}
		top -= 100
		window.scroll({ top, behavior: "smooth" })
	}, 1000)
}
