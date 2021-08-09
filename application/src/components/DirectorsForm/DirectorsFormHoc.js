import { withStyles } from '@material-ui/core/styles';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { addDirectorMutation } from './mutations';
import { directorsQuery } from '../DirectorsTable/queries';
import { styles } from './styles';

const withGraphqlAdd = graphql(addDirectorMutation, {
    props: ({ mutate }) => ({
        addDirector: director => mutate({
            variables: director,
            refetchQueries: [{ query: directorsQuery }]
        })
    })
})

export default compose(withStyles(styles), withGraphqlAdd);
