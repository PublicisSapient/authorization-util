let policyMap = [];

const AuthorizationService = {
  /**
   * asynchronous operation to retrieve profile information from the
   * session cookie - originally intended for NextJS SSR use, but it
   * is functionally stand alone
   */
  profileAuthorize: async (profileURL, tokenHeaderName, token) => {
    const response = await fetch(profileURL, {
      headers: new Headers({
        cookie: `${tokenHeaderName}=${token}`,
      }),
    });

    return response.json();
  },

  /**
   * define a policyMap entry based on role from a token request,
   * but _only_ if the role or scope does not have an existing definiton
   * @param {String} role
   * @param {Array}
   */
  defineRole: (role, policies) => {
    const foundPolicy = policyMap.find((policy) => policy.role === role);

    if (foundPolicy) {
      // no need to make any change, but could use this scenario for
      // ammending existing policy
      return false;
    } else policyMap.push({ role, policies });
  },

  /**
   * return a boolean based on the user's policy authorization
   * @param {Array} roles array of string values representing the roles of the user
   * @param {String} policy the authorization policy to check against
   */
  userCan: (roles, policy) => {
    const rolesFound = policyMap.filter((policy) =>
      roles.includes(policy.role)
    );
    const policiesFound = rolesFound.flatMap((role) => role.policies);
    return policiesFound.includes(policy);
  },

  /**
   * return the current policy map based on all roles and scope
   * values that have been passed - (array _copy_ only!)
   */
  getPolicyMap: () => [...policyMap],
};

export default AuthorizationService;
