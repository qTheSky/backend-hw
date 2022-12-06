import express, {Request, Response} from 'express'

const app = express()
const port = 3000


const HTTP_STATUSES = {
		OK_200: 200,
		CREATED_201: 201,
		NO_CONTENT_204: 204,


		BAD_REQUEST_400: 400,
		NOT_FOUND_404: 404,
}

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

let videos: Video[] = [
		{
				id: 0,
				title: 'string',
				author: 'string',
				canBeDownloaded: true,
				minAgeRestriction: null,
				createdAt: '2022-12-06T13:23:30.896Z',
				publicationDate: '2022-12-06T13:23:30.896Z',
				availableResolutions: [
						'P144'
				]
		}
]

app.delete('/testing/all-data', (req: Request, res: Response) => {
		videos = []
		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.get('/videos', (req: Request, res: Response) => {
		res.status(200).json(videos)
})
app.get('/videos/:id', (req: Request, res: Response) => {
		const foundVideo = videos.find(v => v.id === +req.params.id)
		if (foundVideo) {
				res.status(200).json(foundVideo)
		} else {
				res.sendStatus(404)
		}
})
app.post('/videos', (req: Request, res: Response) => {
		const validation = {
				errorsMessages: [
						{
								message: null as string | null,
								field: null as string | null,
						}
				]
		}
		if (!req.body.title || !req.body.title.trim().length) {
				validation.errorsMessages[0].message = 'title should be in body'
				validation.errorsMessages[0].field = 'title'
				res.status(400).json(validation)
				return
		}
		if (!req.body.author || !req.body.author.trim().length) {
				validation.errorsMessages[0].message = 'author should be in body'
				validation.errorsMessages[0].field = 'author'
				res.status(400).json(validation)
				return
		}

		if (req.body.author.length > 20) {
				validation.errorsMessages[0].message = 'author length must me less than 20 symbols'
				validation.errorsMessages[0].field = 'author'
				res.status(400).json(validation)
				return
		}
		if (req.body.title.length > 40) {
				validation.errorsMessages[0].message = 'title length must me less than 40 symbols'
				validation.errorsMessages[0].field = 'title'
				res.status(400).json(validation)
				return
		}


		const createdVideo: Video = {
				author: req.body.author,
				title: req.body.title,
				availableResolutions: req.body.availableResolutions,
				createdAt: new Date().toISOString(),
				publicationDate: new Date().toISOString(),
				canBeDownloaded: true,
				id: +new Date(),
				minAgeRestriction: null,
		}
		videos.push(createdVideo)
		res.status(HTTP_STATUSES.CREATED_201).send(createdVideo)
})
app.put('videos/:id', (req: Request, res: Response) => {
		const validation = {
				errorsMessages: [
						{
								message: null as string | null,
								field: null as string | null,
						}
				]
		}
		if (req.body.title.length > 40) {
				validation.errorsMessages[0].message = 'title length must me less than 40 symbols'
				validation.errorsMessages[0].field = 'title'
				res.status(400).json(validation)
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