import React, { Component } from 'react';
import { css } from "@emotion/core";
import { ScaleLoader } from "react-spinners";

const override = css`
  display: block-inline;
  margin: 0 auto;
  border-color: white;
  text-align: center;
`;

export class Loader extends Component {
  render() {
    return (
      <div>
        <ScaleLoader
          css={override}
          sizeUnit={"px"}
          size={40}
          color={"#d30a1e"}
          loading={this.props.isLoading} />
      </div>
    )
  }
}