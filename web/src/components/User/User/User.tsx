import type {
  DeleteUserMutation,
  DeleteUserMutationVariables,
  FindUserById,
  User,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_USER_MUTATION: TypedDocumentNode<
  DeleteUserMutation,
  DeleteUserMutationVariables
> = gql`
  mutation DeleteUserMutation($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const EMAIL_USER_MUTATION = gql`
  mutation EmailUserMutation($id: String!) {
    emailUser(id: $id) {
      id
    }
  }
`

interface Props {
  user: NonNullable<FindUserById['user']>
}

const User = ({ user }: Props) => {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User deleted')
      navigate(routes.users())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const [emailUser] = useMutation(EMAIL_USER_MUTATION, {
    onCompleted: () => {
      toast.success('Email sent')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteUserMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete user ' + id + '?')) {
      deleteUser({ variables: { id } })
    }
  }

  const onEmailClick = (user: NonNullable<FindUserById['user']>) => {
    if (confirm(`Are you sure you want to send an email to ${user.id}?`)) {
      emailUser({ variables: { id: user.id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            User {user.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{user.id}</td>
            </tr>
            <tr>
              <th>Display name</th>
              <td>{user.displayName}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Avatar url</th>
              <td>{user.avatarUrl}</td>
            </tr>
            <tr>
              <th>Hashed password</th>
              <td>{user.hashedPassword}</td>
            </tr>
            <tr>
              <th>Salt</th>
              <td>{user.salt}</td>
            </tr>
            <tr>
              <th>Reset token</th>
              <td>{user.resetToken}</td>
            </tr>
            <tr>
              <th>Reset token expires at</th>
              <td>{timeTag(user.resetTokenExpiresAt)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editUser({ id: user.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(user.id)}
        >
          Delete
        </button>
        <button
          type="button"
          className="rw-button rw-button-blue"
          onClick={() => onEmailClick(user)}
        >
          Send email
        </button>
      </nav>
    </>
  )
}

export default User