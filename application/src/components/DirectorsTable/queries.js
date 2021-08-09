import { gql } from 'apollo-boost';

export const directorsQuery = gql`
    query directorQuery {
        directors {
            id
            name
            age
            movies {
                id
                name
            }
        }
    }
`;