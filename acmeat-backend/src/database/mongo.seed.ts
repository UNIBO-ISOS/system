import { Seeder, SeederConfig } from 'mongo-seeding';
import path from 'path';

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authsource=admin`

const config = {
    database: uri,
    dropDatabase: false,
    dropCollections: false
}

export function seed() {
    const seeder = new Seeder(config)
    const collections = seeder.readCollectionsFromPath(path.resolve(process.env.SEED_PATH!), {
        transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId]
    })

    seeder.import(collections)
        .then(() => {
            console.log('completed the seed of db!')
        })
        .catch(err => {
            console.log(err)
        })
}