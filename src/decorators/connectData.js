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

export default (Decorated: *, opts: Opts) => {
  const { api, propsToApiParams, RenderLoading } = { ...defaultOpts, ...opts };
  class Clazz extends Component<*, *> {
    apiParams: *;

    state: {
      result: ?Object
    } = {
      // local state to keep the result id of the query (will be denormalize with the schema+data entities)
      result: null
    };

    sync(apiParams: *) {
      this.apiParams = apiParams;
      this.props
        .dispatch(
          fetchData({
            id: api,
            ...apiParams
          })
        )
        .then(result => {
          this.setState({ result });
        });
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
      const { result } = this.state;
      if (!result) return <RenderLoading {...props} />;
      const extraProps = {
        [api]: denormalize(result, apiSpec[api].responseSchema, data.entities),
        forceUpdate: () => this.sync(this.apiParams)
      };
      return <Decorated {...props} {...extraProps} />;
    }
  }

  return connect(({ data }) => ({ data }))(Clazz);
};
