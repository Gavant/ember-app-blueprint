import { gql } from 'glimmer-apollo';

// TODO these should eventually be moved into an addon, e.g. @gavant/ember-auth-graphql

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            AccessToken
            RefreshToken
            TokenType
            ExpiresIn
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout($refreshToken: String!) {
        # logout returns a plain string on success - we don't need to parse it
        logout(refreshToken: $refreshToken)
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            AccessToken
            TokenType
            ExpiresIn
        }
    }
`;

export const COMPLETE_SIGN_UP = gql`
    mutation CompleteSignUp($input: CompleteSignUpInput!) {
        completeSignUp(input: $input) {
            AccessToken
            TokenType
            ExpiresIn
        }
    }
`;

export const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($username: String!) {
        # forgotPassword returns a plain string on success - we don't need to parse it
        forgotPassword(username: $username)
    }
`;

export const CONFIRM_FORGOT_PASSWORD = gql`
    mutation ConfirmForgotPassword($input: ConfirmForgotPasswordInput!) {
        # confirmForgotPassword returns a plain string on success - we don't need to parse it
        confirmForgotPassword(input: $input)
    }
`;
