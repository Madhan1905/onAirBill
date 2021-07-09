import React from 'react';
import { Button as BootstrapBtn } from "react-bootstrap";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//scss
import "./index.scss";

const Button = (props) => {
  const { name, havingIcon, isRoundButton, buttonType, iconType } = props;
  return (
    <div className="button-style">
      <BootstrapBtn
        className={`${buttonType} ${isRoundButton && "rounded-button"}`}
        size="sm"
        onClick={() => props.onClick()}
      >
        {havingIcon && (
          <FontAwesomeIcon icon={iconType} className="icon-style" />
        )}
        {name}
      </BootstrapBtn>
    </div>
  );
};

Button.propTypes = {
  name: PropTypes.string,
  havingIcon: PropTypes.bool,
  buttonType: PropTypes.string,
  iconType: PropTypes.string
};

Button.defaultProps = {
  havingIcon: false,
  isRoundButton: false,
  buttonType: "btn btn-light"
};

export default Button;
