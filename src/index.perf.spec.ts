import AuthorizationService from "./index";

const printPerfMeasure = (startTime, endTime, unitMeasured) => {
  const millisecondMeasure = Number(endTime - startTime) / 1000000;
  console.log(
    `\x1b[33m`,
    `${unitMeasured} execution time:`,
    `\x1b[36m`,
    `${millisecondMeasure}ms`
  );
};

describe("Performance Benchmark", () => {
  it("useCan operation: 1 roles - 1,000,000 policies", () => {
    /**
     * Setup the auth service with a very performance intesive role config
     */
    AuthorizationService.defineRole(
      "performance_intensive_role",
      (() => {
        const auths = [];
        let authCount = 1000000;
        while (authCount--) auths.push(authCount.toString());
        return auths;
      })()
    );

    const start = process.hrtime.bigint();
    const can = AuthorizationService.userCan(
      ["performance_intensive_role"],
      "900000"
    );
    const end = process.hrtime.bigint();
    printPerfMeasure(start, end, "userCan()");
    expect(can).toEqual(true);

    AuthorizationService.resetPolicyMap();
  });

  it.only("useCan operation: 10,000 roles - 1,000 policies", () => {
    /**
     * Setup the auth service with a very performance intesive role config
     */
    let i = 10;
    let checkedRoles = [];
    while (i--) {
      AuthorizationService.defineRole(
        i.toString(),
        (() => {
          const auths = [];
          let authCount = 50;
          while (authCount--) auths.push(authCount.toString());
          return auths;
        })()
      );
      checkedRoles.push(i.toString());
    }

    const start = process.hrtime.bigint();
    const can = AuthorizationService.userCan(checkedRoles, "25");
    const end = process.hrtime.bigint();
    printPerfMeasure(start, end, "userCan()");
    expect(can).toEqual(true);
  });
});
