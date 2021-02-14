import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { createExpressServer } from 'routing-controllers'
import { ShoeController } from './controller/ShoeController'

createConnection()
  .then(async () => {
    createExpressServer({
      controllers: [ShoeController],
    }).listen(3000)
    console.log('Server is up and running on port 3000.')
  })
  .catch((error) => console.log('Error: ', error))
