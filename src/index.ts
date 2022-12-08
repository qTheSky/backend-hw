import express, {Request, Response} from 'express'

const app = express()
const port = 3000


const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

interface Video {
		id: number
		title: string
		author: string
		canBeDownloaded: boolean
		minAgeRestriction: null | number
		createdAt: string
		publicationDate: string
		availableResolutions: null | string[]
}

const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

let videos: Video[] = [
		// {
		// 		id: 0,
		// 		title: 'string',
		// 		author: 'string',
		// 		canBeDownloaded: true,
		// 		minAgeRestriction: null,
		// 		createdAt: '2022-12-06T13:23:30.896Z',
		// 		publicationDate: '2022-12-06T13:23:30.896Z',
		// 		availableResolutions: [
		// 				'P144'
		// 		]
		// }
]

app.delete('/testing/all-data', (req: Request, res: Response) => {
		videos = []
		res.sendStatus(204)
})

app.get('/videos', (req: Request, res: Response) => {
		res.status(200).send(videos)
})
app.get('/videos/:id', (req: Request, res: Response) => {
		const foundVideo = videos.find(v => v.id === +req.params.id)
		if (foundVideo) {
				res.status(200).send(foundVideo)
		} else {
				res.sendStatus(404)
		}
})
app.post('/videos', (req: Request, res: Response) => {
		const validation = {
				errorsMessages: [] as Array<{ message: string, field: string }>
		}

		if (!req.body.title || req.body.title.trim().length > 40) {
				validation.errorsMessages.push({message: 'title should exist and < 40 symbols', field: 'title'})
		}
		if (!req.body.author || req.body.author.trim().length > 20) {
				validation.errorsMessages.push({message: 'author should exist and < 20 symbols', field: 'author'})
		}
		if (!req.body.availableResolutions.every((r: string) => availableResolutions.includes(r))) {
				validation.errorsMessages.push({
						message: 'available resolutions are P144, P240, P360, P480, P720, P1080, P1440, P2160',
						field: 'availableResolutions'
				})
		}
		if (validation.errorsMessages.length) {
				res.status(400).send(validation)
				return
		}


		const currentDate = new Date()
		const createdVideo: Video = {
				author: req.body.author,
				title: req.body.title,
				availableResolutions: req.body.availableResolutions,
				createdAt: currentDate.toISOString(),
				publicationDate: new Date(currentDate.setDate(currentDate.getDate() + 1)).toISOString(),
				canBeDownloaded: true,
				id: +new Date(),
				minAgeRestriction: null,
		}

		videos.push(createdVideo)
		res.status(201).send(createdVideo)
})

app.put('/videos/:id', (req: Request, res: Response) => {
		const validation = {
				errorsMessages: [] as Array<{ message: string, field: string }>
		}

		if (!req.body.title || req.body.title.trim().length > 40) {
				validation.errorsMessages.push({message: 'title should exist and < 40 symbols', field: 'title'})
		}
		if (!req.body.author || req.body.author.trim().length > 20) {
				validation.errorsMessages.push({message: 'author should exist and < 20 symbols', field: 'author'})
		}
		if (typeof req.body.minAgeRestriction !== 'number' || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1) {
				validation.errorsMessages.push({
						message: 'minAgeRestriction should be 1-18 or null ',
						field: 'minAgeRestriction'
				})
		}
		if (typeof req.body.publicationDate !== 'string') {
				validation.errorsMessages.push({
						message: 'incorrect publicationDate',
						field: 'publicationDate'
				})
		}
		if (typeof req.body.canBeDownloaded !== 'boolean') {
				validation.errorsMessages.push({message: 'canBeDownloaded should be boolean', field: 'canBeDownloaded'})
		}
		if (validation.errorsMessages.length) {
				res.status(400).send(validation)
				return
		}

		const foundVideo = videos.find(v => v.id === +req.params.id)
		if (foundVideo) {
				foundVideo.title = req.body.title
				foundVideo.author = req.body.author
				foundVideo.availableResolutions = req.body.availableResolutions
				res.sendStatus(204)
		} else {
				res.sendStatus(404)
		}

})
app.delete('/videos/:id', (req: Request, res: Response) => {
		const foundVideo = videos.find(v => v.id === +req.params.id)
		if (foundVideo) {
				videos = videos.filter(v => v.id !== +req.params.id)
				res.sendStatus(204)
		} else {
				res.sendStatus(404)
		}
})

app.get('/', (req: Request, res: Response) => {
		res.send('Hello world')
})
app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
})
