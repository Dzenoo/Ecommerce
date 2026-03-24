import { AdminNavbarActions, UserNavbarActions } from "../../constants";

export const getRoleSpecificData = (
  isAdmin: boolean,
): {
  actions: typeof AdminNavbarActions | typeof UserNavbarActions;
} => {
  return {
    actions: isAdmin ? AdminNavbarActions : UserNavbarActions,
  };
};
