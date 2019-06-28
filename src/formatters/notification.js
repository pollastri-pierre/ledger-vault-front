// @flow

export const success = (resource: string, action: string) => ({
  title: `${resource} ${action}`,
  content: `The ${resource} has been successfully ${action}`,
});
