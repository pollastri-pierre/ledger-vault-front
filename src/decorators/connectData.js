//@flow
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import apiSpec from '../data/api-spec';
import { fetchData } from '../redux/modules/data';
import SpinnerCard from '../components/spinners/SpinnerCard';

type Opts = {
  api: string,
  propsToApiParams?: (props: Object) => Object,
  RenderLoading?: (props: Object) => *
};

const defaultOpts = {
  RenderLoading: SpinnerCard,
  propsToApiParams: _ => null
};

let requestId = 0;

export default (Decorated: *, opts: Opts) => {
  const { api, propsToApiParams, RenderLoading } = { ...defaultOpts, ...opts };
  class Clazz extends Component<*> {
    apiParams: *;
    requestId: number = 0;
    sync(apiParams: *) {
      this.apiParams = apiParams;
      requestId++;
      this.requestId = requestId;
      this.props.dispatch(
        fetchData({
          id: api,
          requestId,
          ...apiParams
        })
      );
    }
    componentWillMount() {
      this.sync(propsToApiParams(this.props));
    }
    componentWillReceiveProps(props: *) {
      const apiParams = propsToApiParams(props);
      if (!isEqual(apiParams, this.apiParams)) {
        this.sync(apiParams);
      }
    }
    render() {
      const { data, ...props } = this.props;
      const result = data.requestResults[this.requestId];
      console.log('data', data);
      if (!result) return <RenderLoading {...props} />;
      const extraProps = {
        [api]: denormalize(result, apiSpec[api].responseSchema, data.entities)
      };
      console.log(extraProps);
      return <Decorated {...props} {...extraProps} />;
    }
  }

  return connect(({ data }) => ({ data }))(Clazz);
};
