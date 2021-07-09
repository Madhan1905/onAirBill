import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const Context = createContext({});

export const Provider = props => {
  const {
    loggedIn: initialLoggedIn,
    printEnable: initialPrintEnable,
    children
  } = props;

  const [loggedIn, setLoggedIn] = useState(initialLoggedIn);
  const [printEnable, setPrintEnable] = useState(initialPrintEnable);

  const totalPriceContext = {
    loggedIn,
    setLoggedIn,
    printEnable,
    setPrintEnable,
    ability: 'read',
  };

  return <Context.Provider value={totalPriceContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

Provider.propTypes = {
  loggedIn: PropTypes.bool,
  printEnable: PropTypes.bool
};

Provider.defaultProps = {
  loggedIn: false,
  printEnable: false
};
