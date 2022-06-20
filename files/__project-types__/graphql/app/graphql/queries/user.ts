import { gql } from 'glimmer-apollo';

export const GET_USERS = gql`
    query GetUsers {
        users {
            id
            dateCreated
            dateUpdated
            username
            cognitoUsername
            email
        }
    }
`;

export const GET_USER = gql`
    query GetUser($id: Int!) {
        user(id: $id) {
            id
            dateCreated
            dateUpdated
            username
            cognitoUsername
            email
        }
    }
`;

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        currentUser {
            id
            dateCreated
            dateUpdated
            username
            cognitoUsername
            email
        }
    }
`;
