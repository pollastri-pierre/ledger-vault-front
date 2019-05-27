// @flow

export const success = (resource: string, action: string) => ({
  title: `${resource} ${action}`,
  content: `the ${resource} has been successfully ${action}`,
});
