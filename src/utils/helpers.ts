import { ACTION, PERMISSION } from "../enums/permission";

export const checkExistence = (
    adminPermissions: PERMISSION[],
    checkItems: PERMISSION[],
  ) => {
    return checkItems.every((item) => {
      const hasModule = adminPermissions.find(
        (aPermission: PERMISSION) => aPermission.module === item.module,
      );
  
      if (hasModule) {
        const permissionActions = hasModule.action;
        const actionCheck = checkActionsExist(permissionActions, item.action);
        return actionCheck;
      }
  
      return hasModule;
    });
  };

  function checkActionsExist(list: ACTION[], checkActions: ACTION[]) {
    if (list.includes(ACTION.ALL)) {
      return true;
    }
    if (checkActions.includes(ACTION.ALL)) {
      return true;
    }
    return checkActions.every((action) => list.includes(action));
  }