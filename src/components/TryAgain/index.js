// @flow
import React, { useState, useEffect } from "react";
import errorFormatter from "formatters/error";
import NoDataPlaceholder from "components/NoDataPlaceholder";
import CenteredLayout from "components/base/CenteredLayout";
import Card from "components/base/Card";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { ModalBody } from "components/base/Modal";

import colors from "shared/colors";

type Props = {
  action: () => Promise<*> | *,
  error: Error,
};

function TryAgain(props: Props) {
  const { error, action } = props;
  const [pending, setPending] = useState(false);
  let _unmounted = false;

  useEffect(() => {
    return () => {
      _unmounted = false;
    };
  }, []);

  function onclick(e: Event) {
    e.preventDefault();
    const { action } = props;
    if (pending) return;
    setPending(true);
    Promise.resolve()
      .then(action)
      .catch(e => e)
      .then(() => {
        if (_unmounted) return;
        setPending(false);
      });
  }

  return (
    <CenteredLayout onClick={onclick}>
      <Card>
        <ModalBody>
          <Box mb={30} align="center" color={colors.grenade}>
            <Text bold>{errorFormatter(error)}</Text>
          </Box>
          <NoDataPlaceholder title="En error occured" />
          {action && (
            <Box mt={30} align="center" color={colors.lead}>
              <Text style={{ cursor: "pointer" }}>Reload</Text>
            </Box>
          )}
        </ModalBody>
      </Card>
    </CenteredLayout>
  );
}

export default TryAgain;
