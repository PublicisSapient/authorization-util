# Authorization Util

![unit tests](https://github.com/PublicisSapient/authorization-util/actions/workflows/node.js.yml/badge.svg)

![minified](https://img.shields.io/bundlephobia/min/@publicissapient/authorizationutil)

Simplistic authorization management - alternative to heavy (though much more robust) solutions. The core idea is that a user has already been _authenticated_ (like having a JWT, for example), and we now need to effectively manage the _authorization_ for whatever role they may have.

Most simply put, this is intended to allow an initial configuration of mapping authorizations to a set of roles that are available. The functionality is a very small subset of what you may get from something like [CASL](https://casl.js.org/v5/en/), but with a miniscul footprint and zero dependencies. If all you need are the _very_ basics, this may suit your needs.

## Getting going...

```javascript
import AuthorizationService from ".";

/**
 * Role definitions somewhere on app initialization
 */
AuthorizationService.defineRole("admin", [
  "can_create_profile",
  "can_edit_profile",
  "can_view_profile",
]);
AuthorizationService.defineRole("employee", [
  "can_edit_profile",
  "can_view_profile",
]);
AuthorizationService.defineRole("customer", ["can_view_profile"]);

/**
 * Example usage:
 *
 * 1. The create button will only render for the admin role
 * 2. The edit button will only render for admin and employee roles
 * 3. The description will display for all three roles
 */
render(
  <>
    {AuthorizationService.userCan(currentRole, "can_create_profile") && (
      <Button>Create Profile</Button>
    )}

    {AuthorizationService.userCan(currentRole, "can_edit_profile") && (
      <Button>Edit Profile</Button>
    )}

    {AuthorizationService.userCan(currentRole, "can_view_profile") && (
      <p>A profile description...</p>
    )}
  </>
);
```

## Test

```shell
npm run test

# we also have a ci specific test command that outputs coverage
npm run test-ci
```

## Typescript

Typescript was introduced as of v1.2.0.

---

![dennis-nedry-gif-7](https://user-images.githubusercontent.com/2083532/175975750-8feff818-b610-41ba-ac5e-a39d9b28fc8f.gif)
