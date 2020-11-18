const { ApolloServer, gql } = require('apollo-server');
const data = require('./server/index');

const typeDefs = gql`
    type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
    }

    type Query {
        unsplashImages(pageNum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
    }

    type Mutation {
        uploadImage(
            url: String!
            description: String
            posterName: String
        ): ImagePost
        updateImage(
            id: ID!
            url: String
            posterName: String
            description: String
            userPosted: Boolean
            binned: Boolean
        ): ImagePost
        deleteImage(id: ID!): ImagePost
    }
`;

const resolvers = {
    Query: {
        unsplashImages: (_, args) => {
            return data.unsplashImages(args.pageNum);
        },
        binnedImages: () => {
            return data.binnedImages();
        },
        userPostedImages: () => {
            return data.userPostedImages();
        },
    },
    Mutation: {
        uploadImage: (_, args) => {
            return data.uploadImage(
                args.url,
                args.description,
                args.posterName
            );
        },
        updateImage: (_, args) => {
            return data.updateImage(
                args.id,
                args.url,
                args.posterName,
                args.description,
                args.userPosted,
                args.binned
            );
        },
        deleteImage: (_, args) => {
            return data.deleteImage(args.id);
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then((url) => {
    console.log(`🚀  Server ready at ${url}🚀`);
});
