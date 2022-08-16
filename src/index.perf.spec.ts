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

  it("useCan operation:", () => {
    const start = process.hrtime.bigint();
    const can = AuthorizationService.userCan(
      ["performance_intensive_role"],
      "500000"
    );
    const end = process.hrtime.bigint();
    printPerfMeasure(start, end, "userCan()");
    expect(can).toEqual(true);
  });
});
