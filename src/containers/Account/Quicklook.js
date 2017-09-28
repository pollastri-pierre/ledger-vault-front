import _ from 'lodash';
import React from 'react';
import { SpinnerCard } from '../../components';
import QuicklookGraph from './QuicklookGraph';

function Quicklook(props) {
  const { operations, loading } = props;

  return (
    <div className="bloc quicklook">
      <h3>Quicklook</h3>
      { (loading || _.isNull(operations)) ?
          <SpinnerCard />
        :
        <QuicklookGraph data={operations} loading={loading} />
      }
    </div>
  );
}

export default Quicklook;

