import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useCreateEntityMutation, useGetVersionQuery } from './generated/graphql'

function App() {
  const { data, error, loading } = useGetVersionQuery();

  const [createEntityMutation, { data: mData, error: mError, loading: mLoading }] = useCreateEntityMutation()

  const createEntity = async () => {
    const res = await createEntityMutation({ variables: { data: { text: "test" } } })
    console.log(res)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {loading && <h1>loading...</h1>}
        {data && <h1>App is running on Version {data.version}</h1>}

        <button
          onClick={createEntity}
          disabled={mLoading}
        >
          Create Entity
        </button>

      </header>
    </div>
  );
}

export default App;
