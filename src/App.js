import React, { Component }from 'react';
import { Provider, connect } from "react-redux";
import RootContainerComponent from "./container/RootContainerComponent"
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducers from "./reducers/rootReducers"

let RootContainer = connect()(RootContainerComponent);

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducers, composeEnhancer(applyMiddleware(thunk)));

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    );
  }
}
