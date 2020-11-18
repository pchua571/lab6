import { gql } from '@apollo/client';

const GET_UNSPLASHIMAGES = gql`
    query A($pageNum: Int!) {
        unsplashImages(pageNum: $pageNum) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_BINNEDIMAGES = gql`
    query {
        binnedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_USERPOSTEDIMAGES = gql`
    query {
        userPostedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const ADD_IMAGE = gql`
    mutation A(
        $url: String!
        $description: String
        $posterName: String
    ) {
        uploadImage(
            url: $url
            description: $description
            posterName: $posterName
        ) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const UPDATE_IMAGE = gql`
    mutation A($id: ID! $url: String! $description: String $posterName: String $userPosted: Boolean $binned: Boolean) {
        updateImage(id:$id url: $url description: $description posterName: $posterName userPosted: $userPosted binned: $binned) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const DEL_IMAGE = gql`
    mutation A($id: ID!) {
        deleteImage(id: $id) {
            id
        }
    }
`;

export default {
    GET_UNSPLASHIMAGES,
    GET_BINNEDIMAGES,
    GET_USERPOSTEDIMAGES,
    ADD_IMAGE,
    UPDATE_IMAGE,
    DEL_IMAGE,
};
