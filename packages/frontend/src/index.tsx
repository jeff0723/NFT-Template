import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core';
import Web3ReactManager from './components/Web3ReactManager'
function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(
    provider
  )
  library.pollingInterval = 15_000
  library.detectNetwork().then(network => console.log("detected network:", network))
  return library
}
const NetworkContextName = 'NETWORK'
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)


ReactDOM.render(
  <React.StrictMode>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactManager>
          <App />
        </Web3ReactManager>
      </Web3ReactProvider>
    </Web3ProviderNetwork>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
