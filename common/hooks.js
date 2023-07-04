import Moment from "@Modules/moment"
import "@Modules/moment-duration-format"
import { extendMoment } from "@Modules/moment-range"

const moment = extendMoment(Moment)
moment.locale("fr")

export const useMoment = () => {
	return moment
}

import { EventSourcePolyfill } from "@Modules/event-source-polyfill"

export const useEventSource = ({ user, env }) => {
	const MERCURE_URL = new URL(process.env.VUE_APP_MERCURE_URL)
	MERCURE_URL.searchParams.append(
		"topic",
		`${process.env[`VUE_APP_MERCURE_TOPIC_${env}`]}${user}`
	)

	const ES = (useEventSource.cache ??= new EventSourcePolyfill(MERCURE_URL, {
		lastEventIdQueryParameterName: "Last-Event-Id",
		headers: {
			Authorization: `Bearer ${process.env[`VUE_APP_MERCURE_JWT_${env}`]}`,
		},
	}))

	/**
	 * Add Event listener
	 * @param {"open" | "message" | "error"} event
	 * @param {() => void} callback
	 */
	const on = (event, callback) => {
		ES.addEventListener(event, callback)
	}

	const onOpen = callback => on("open", callback)
	const onMessage = callback => onOpen(() => on("message", callback))
	const onError = callback => on("error", callback)
	const close = () => ES.close?.()

	return { on, onOpen, onMessage, onError, close }
}
