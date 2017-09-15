import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';


// Set blur status to root element on dispatch
const mapStateToProps = state => ({
  operations: state.operations,
});

// const mapDispatchToProps = (dispatch) => {
//   return { 
//     onLogout: () => dispatch(logout()),
//     onOpenCloseProfile: (target) => dispatch(openCloseProfile(target)),
//     onOpenCloseEdit: () => dispatch(openCloseEdit())
//   };
// };

function OperationsList(props) {
  return (
    <div>
      <h2>Operations details</h2>
      <Link to="?operationDetail=1">operation id1</Link>
      <Link to="?operationDetail=2">operation id2</Link>
      <Link to="?operationDetail=3">operation id3</Link>
    </div>
  );
}

OperationsList.propTypes = {
  operations: PropTypes.object,
};

export { OperationsList };

export default withRouter(connect(mapStateToProps)(OperationsList));

