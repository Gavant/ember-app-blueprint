import { gql } from 'glimmer-apollo';

export const ADD_USER = gql`
    mutation AddUser($input: AddUserInput!) {
        addUser(input: $input) {
            id
            dateCreated
            dateUpdated
            username
            cognitoUsername
            email
        }
    }
`;
