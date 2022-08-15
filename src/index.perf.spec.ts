import AuthorizationService from "./index";

describe("Performance Benchmark", () => {
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

    AuthorizationService.userCan(["performance_intensive_role"], "999999");

    const end = process.hrtime.bigint();
    console.log(`useCan() execution time: ${Number(end - start) / 1000000}ms`);
  });
});
