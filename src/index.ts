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
		res.sendStatus(204)
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
		res.status(201).send(createdVideo)
})
app.put('/videos/:id', (req: Request, res: Response) => {

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