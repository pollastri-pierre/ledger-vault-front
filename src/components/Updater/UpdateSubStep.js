// @flow

import React, { useState } from "react";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useSpring, animated } from "react-spring";
import { useTranslation } from "react-i18next";

import { TimelineStop } from "components/base/Timeline";

import Spinner from "components/base/Spinner";
import ProgressBar from "components/base/ProgressBar";
import TranslatedError from "components/TranslatedError";
import Button from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";
import colors from "shared/colors";
import LedgerBlue from "components/LedgerBlue";
import {
  Processing,
  DashBoard,
  OsUpdater,
  UpdateFirmware,
  AllowManager,
} from "components/LedgerBlue/screens";

import { SUBSTEPS } from "./UpdatePlan";
import type { SubStep, VaultUpdatePlanStepStatus } from "./UpdatePlan";
import { Container } from "./components";

const PROGRESS_ALLOW_THRESOLD = 0.97;
const IconSpinner = () => <Spinner size="big" color={colors.bLive} />;

type UpdateSubStepProps = {
  status: VaultUpdatePlanStepStatus,
  substep: SubStep,
  subject: rxjs$Subject<{ type: "click" }>,
  index: number,
  error: ?Error,
};

export const UpdateSubStepContainer = ({
  substep,
  onClick,
  loading,
  error,
  t,
}: {
  substep: SubStep,
  onClick: void => void,
  loading: boolean,
  error?: ?Error,
  t: Function,
}) => {
  const { type, progress, isRequestingPermission } = substep;
  const isRebootStep =
    type === SUBSTEPS.REBOOT_OSU || type === SUBSTEPS.REBOOT_FINAL;
  const isInstallStep =
    type === SUBSTEPS.OSU || type === SUBSTEPS.FINAL || type === SUBSTEPS.APP;

  const isPromptingUser =
    type === SUBSTEPS.OSU && progress && progress > PROGRESS_ALLOW_THRESOLD;

  if (isRebootStep) {
    return (
      <Box horizontal align="center" flow={20}>
        <Box width={180} noShrink>
          <LedgerBlue size="small">
            {type === SUBSTEPS.REBOOT_OSU ? <OsUpdater /> : <DashBoard />}
          </LedgerBlue>
        </Box>
        <WaitForReboot error={error} loading={loading} onClick={onClick} />
      </Box>
    );
  }
  if (isInstallStep) {
    return (
      <Box horizontal flow={20} align="center">
        <Box width={180} noShrink>
          <LedgerBlue size="small">
            {isPromptingUser ? (
              <UpdateFirmware />
            ) : isRequestingPermission ? (
              <AllowManager />
            ) : (
              <Processing />
            )}
          </LedgerBlue>
        </Box>
        {isPromptingUser ? (
          <PromptScreen />
        ) : isRequestingPermission ? (
          <AllowPermissionScreen />
        ) : (
          <ProcessingScreen t={t} substep={substep} />
        )}
      </Box>
    );
  }
  return null;
};

const UpdateSubStep = ({
  status,
  substep,
  subject,
  error,
  index,
}: UpdateSubStepProps) => {
  const { isRunning, isDone } = substep;
  const isLast = index === status.substeps.length - 1;

  const animation = useSpring({
    opacity: isRunning ? 1 : 0,
    transform: isRunning ? "translateX(0px)" : "translateX(-20px)",
  });

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onClick = () => {
    setLoading(true);
    subject.next({ type: "click" });
  };

  const isReboot =
    substep.type === SUBSTEPS.REBOOT_OSU ||
    substep.type === SUBSTEPS.REBOOT_FINAL;
  return (
    <TimelineStop
      key={substep.type}
      bulletSize="small"
      bulletVariant={isRunning ? "plain" : undefined}
      Icon={
        isRunning
          ? error
            ? MdError
            : isReboot
            ? FaArrowRight
            : IconSpinner
          : isDone
          ? FaCheck
          : FaArrowRight
      }
      bar="full"
      indentation={1}
      rope={isLast ? "inverted" : undefined}
    >
      {error && isRunning ? (
        <ErrorScreen error={error} onClick={onClick} loading={loading} />
      ) : isRunning ? (
        <animated.div style={animation}>
          <Container style={{ width: 500 }}>
            <UpdateSubStepContainer
              substep={substep}
              onClick={onClick}
              loading={loading}
              error={error}
              t={t}
            />
          </Container>
        </animated.div>
      ) : isDone ? (
        t(`update:steps.${substep.type}.done`)
      ) : (
        t(`update:steps.${substep.type}.to-do`)
      )}
    </TimelineStop>
  );
};

export default UpdateSubStep;

const ErrorScreen = ({
  error,
  onClick,
  loading,
}: {
  error: Error,
  onClick: Function,
  loading: boolean,
}) => (
  <Container style={{ width: 500 }}>
    <Box p={20} flow={20}>
      <Box align="center">
        <MdError color="red" size={16} />
        <Text color="red" textAlign="center">
          <TranslatedError error={error} field="description" />
        </Text>
      </Box>
      <Button type="filled" onClick={onClick} isLoadingProp={!error && loading}>
        Continue
      </Button>
    </Box>
  </Container>
);
const PromptScreen = () => (
  <Box width={300} flow={20}>
    <Text i18nKey="update:steps.promptDenyTitle" fontWeight="bold" />
    <Text i18nKey="update:steps.promptDeny" />
  </Box>
);

const AllowPermissionScreen = () => (
  <Box>
    <Text fontWeight="bold">Permission</Text>
    <Text>You have to accept the update on your device</Text>
  </Box>
);
const ProcessingScreen = ({
  substep,
  t,
}: {
  substep: SubStep,
  t: Function,
}) => (
  <Box flow={10}>
    <Box>
      <Text fontWeight="bold">{t(`update:steps.${substep.type}.doing`)}</Text>
      <Text i18nKey="update:steps.waitProcessing" />
    </Box>
    <Box width={240}>
      <ProgressBar
        progress={substep.progress}
        height={30}
        indeterminate={!substep.progress}
      />
    </Box>
  </Box>
);

const WaitForReboot = ({
  error,
  loading,
  onClick,
}: {
  error: ?Error,
  loading: boolean,
  onClick: Function,
}) => (
  <Box width={300} flow={20}>
    <Text fontWeight="bold">Device rebooting</Text>
    <Text i18nKey="update:steps.waitReboot" />
    <Box position="relative">
      <Button type="filled" onClick={onClick} isLoadingProp={!error && loading}>
        <Text i18nKey="update:steps.continueAfterReboot" />
      </Button>
      <Box position="absolute" style={{ bottom: -25, right: 0 }}>
        {error && error.message && (
          <Text color={colors.grenade}>{error.message}</Text>
        )}
      </Box>
    </Box>
  </Box>
);
