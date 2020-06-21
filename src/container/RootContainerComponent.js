import React, { Component } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import todos from "../components/todos";
import NotFound from "../components/notFound";

import "../styles.css";
import "antd/dist/antd.css";

class RootContainerComponent extends Component {
    render() {
      return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={todos} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      );
    }
  }
export default RootContainerComponent;