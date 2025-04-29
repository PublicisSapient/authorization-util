/**
 * ENV set to "node" to assert functionality executing on the server.
 * This setting is redundant to the default jest config in `jest.config.js`,
 * but is helpful to have here for clarity.
 * @jest-environment node
 */

import AuthorizationService from "./index";

describe("Authorization Service :: Node", () => {
  it("initializes with empty policy map", () => {
    expect(AuthorizationService.getPolicyMap()).toEqual([]);
  });

  it("retrieves profile information asychronously with profileAuthorize() invocation", async () => {
    // mocking fetch for this test, but if it becomes relevant to other tests in this suite, it
    // should be elevated to the whole suite (describe)

    // ignoring this type error for now since it is for a mock in test
    // need to revisit this
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ roles: ["contact_center_associate"] }),
      }),
    );

    const aToken = "a_sample_token";
    const aTokenHeader = "token-header";
    const aProfileURL = "sample/profile/url";
    const profile = await AuthorizationService.profileAuthorize(
      aProfileURL,
      aTokenHeader,
      aToken,
    );

    expect(global.fetch).toHaveBeenCalledWith(aProfileURL, {
      headers: new Headers({
        cookie: `token-header=a_sample_token`,
      }),
    });
    expect(profile).toEqual({ roles: ["contact_center_associate"] });
  });

  it("adds a policy when defineUser() called with new role(s)", () => {
    AuthorizationService.defineRole("contact_center_associate", [
      "manualPayments",
      "existingOrderCancellation",
      "common_auth",
    ]);

    expect(AuthorizationService.getPolicyMap()).toEqual([
      {
        role: "contact_center_associate",
        policies: [
          "manualPayments",
          "existingOrderCancellation",
          "common_auth",
        ],
      },
    ]);

    AuthorizationService.defineRole("store_associate", [
      "ingredientLocking",
      "common_auth",
    ]);

    expect(AuthorizationService.getPolicyMap()).toEqual([
      {
        role: "contact_center_associate",
        policies: [
          "manualPayments",
          "existingOrderCancellation",
          "common_auth",
        ],
      },
      {
        role: "store_associate",
        policies: ["ingredientLocking", "common_auth"],
      },
    ]);
  });

  it("does not add a new policy if the role has already been defined", () => {
    expect(
      AuthorizationService.defineRole("store_associate", ["ingredientLocking"]),
    ).toBe(false);

    expect(AuthorizationService.getPolicyMap()).toEqual([
      {
        role: "contact_center_associate",
        policies: [
          "manualPayments",
          "existingOrderCancellation",
          "common_auth",
        ],
      },
      {
        role: "store_associate",
        policies: ["ingredientLocking", "common_auth"],
      },
    ]);
  });

  it("returns access confirmation or denial based on provided role information", () => {
    expect(
      AuthorizationService.userCan(
        ["contact_center_associate"],
        "manualPayments",
      ),
    ).toBe(true);
    expect(
      AuthorizationService.userCan(["store_associate"], "ingredientLocking"),
    ).toBe(true);
    expect(
      AuthorizationService.userCan(
        ["contact_center_associate"],
        "ingredientLocking",
      ),
    ).toBe(false);
    expect(
      AuthorizationService.userCan(["store_associate"], "manualPayments"),
    ).toBe(false);
    expect(
      AuthorizationService.userCan(["store_associate"], "common_auth"),
    ).toBe(true);
    expect(
      AuthorizationService.userCan(
        ["store_associate", "contact_center_associate"],
        "unregistered_policy",
      ),
    ).toBe(false);
    expect(
      AuthorizationService.userCan(
        ["store_associate", "contact_center_associate"],
        "common_auth",
      ),
    ).toBe(true);
  });
});
