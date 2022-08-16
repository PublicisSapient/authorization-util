# Simple Performance Profiling `userCan()`

The following are performance comparisons for iterations on the `userCan()` API method.

## `policiesFound.includes(policy)`

This is a lookup against the possible policies for a particular role is done in order to determine of a role is or is not allowed to do something.

---

1,000,000 policies and looking for a match on the 500,000 policy entry

| array.includes()        | reverse while loop      |
| ----------------------- | ----------------------- |
| exec time: 106.124ms    | exec time: 110.210458ms |
| exec time: 106.930834ms | exec time: 114.666791ms |
| exec time: 105.680334ms | exec time: 108.691833ms |

---

1,000,000 policies and looking for a match on the 900,000 policy entry

| array.includes()        | reverse while loop      |
| ----------------------- | ----------------------- |
| exec time: 107.454583ms | exec time: 112.774084ms |
| exec time: 107.056625ms | exec time: 115.01075ms  |
| exec time: 107.046042ms | exec time: 111.326375ms |

---

### Conclusion

No benefit of loop over `array.includes()` (and perhaps includes is slightly advantageous).

## `rolesFound.flatMap((role) => role.policies)`

This creates a flat array of the policy arrays from all matched roles.

---

10,000 found roles, each with 1000 associated policies

| array.flatMap()          | reverse while loop      |
| ------------------------ | ----------------------- |
| exec time: 1220.736542ms | exec time: 446.816208ms |
| exec time: 1255.740041ms | exec time: 457.572667ms |
| exec time: 1227.44775ms  | exec time: 429.470834ms |

---

10 found roles with 50 associated policies (somewhat closer to "realistic")

| array.flatMap()       | reverse while loop    |
| --------------------- | --------------------- |
| exec time: 0.081458ms | exec time: 0.071166ms |
| exec time: 0.087875ms | exec time: 0.087ms    |
| exec time: 0.082083ms | exec time: 0.076042ms |

---

### Conclusion

While the _realistic_ use case for this actually seems to provide imperceptable performance gain, it seems worth making the change for not only the miniscule (though exponential at scale) performance benefit, but also the fact that we additionally efficiently remove dupes from the working policy array.

Change made:

```javascript
/**
 * REMOVED
 */
const policiesFound = rolesFound.flatMap((role) => role.policies);
return policiesFound.includes(policy);

/**
 * ADDED
 */
const policiesFound = [];
let rolesFoundIterator = rolesFound.length;
while (rolesFoundIterator--) {
  let policiesIterator = rolesFound[rolesFoundIterator].policies.length;
  while (policiesIterator--) {
    policiesFound.push(
      rolesFound[rolesFoundIterator].policies[policiesIterator]
    );
  }
}

const policySet = [...new Set(policiesFound)];
return policySet.includes(policy);
```
