const graphql = require('graphql');
const mongoose = require('mongoose');

const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        watched: { type: new GraphQLNonNull(GraphQLBoolean)},
        rate: { type: GraphQLInt },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(d => d.id == parent.id)
                return Directors.findById(parent.directorId);
                
            }
        }
    })
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(m => m.directorId == parent.id)
                return Movies.find({ directorId: mongoose.Types.ObjectId(parent.id) });
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age
                });
                return director.save();
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
                watched: { type: new GraphQLNonNull(GraphQLBoolean)},
                rate: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: mongoose.Types.ObjectId(args.directorId),
                    watched: args.watched,
                    rate: args.rate
                });
                return movie.save();
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id)
            }
        },
        deleteMovie: {
            type: MovieType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id)
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age
                        }
                    },
                    // єта опция позволяет в ответе увидеть обновленные данные
                    { new: true }
                )
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
                watched: { type: new GraphQLNonNull(GraphQLBoolean)},
                rate: { type: GraphQLInt }
            },
            resolve(parent, args) {
                return Movies.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            genre: args.genre,
                            directorId: args.directorId,
                            watched: args.watched,
                            rate: args.rate
                        }
                    },
                    // эта опция позволяет в ответе увидеть обновленные данные
                    { new: true }
                )
            }
        },
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLString }},
            resolve(parent, args) {
                // return movies.find(m => m.id == args.id)
                return Movies.findById(mongoose.Types.ObjectId(args.id));
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLString }},
            resolve(parent, args) {
                // return directors.find(d => d.id == args.id)
                return Directors.findById(mongoose.Types.ObjectId(args.id));
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies;
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors;
                return Directors.find({});
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});