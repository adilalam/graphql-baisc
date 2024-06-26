import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// data
import db from './_db.js'

// types
import { typeDefs } from './schema.js'

// resolvers
const resolvers = {
    Query: {
        games() {
            return db.games
        },
        game(_, args) {
            return db.games.find((game) => game.id == args.id)
        },
        authors() {
            return db.authors
        },
        author(_, args) {
            return db.authors.find((author) => author.id == args.id)
        },
        reviews() {
            return db.reviews
        },
        review(_, args) {
            return db.reviews.find((review) => review.id == args.id)
        },
    },
    Game: {
        reviews(parent, args, context) {
            return db.reviews.filter((review) => review.game_id == parent.id);
        }
    },
    Author: {
        reviews(parent, args, context) {
            return db.reviews.filter((review) => review.author_id == parent.id);
        }
    },
    Review: {
        author(parent, args, content) {
            return db.authors.find((author) => author.id == parent.author_id)
        },
        game(parent, args, content) {
            return db.games.find((game) => game.id == parent.game_id)
        }
    },
    Mutation: {
        deleteGame(_, args, context) {
            db.games = db.games.filter((game) => game.id != args.id);
            return db.games;
        },
        addGgame(_, args, context) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 1000).toString()
            }

            db.games.push(game);

            return game;
        }
    }
}

// server setup
const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)