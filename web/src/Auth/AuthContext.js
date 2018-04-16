import React from 'react';

export const AuthContext = React.createContext();

export function withAuth(Component) {
  return function AuthComponent(props) {
    return (
      <AuthContext.Consumer>
        {auth => <Component {...props} auth={auth} />}
      </AuthContext.Consumer>
    );
  };
}