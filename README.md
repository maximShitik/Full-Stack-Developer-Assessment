# Full-Stack-Developer-Assessment
Design Decisions / Assumptions (Section A - Python)

1) Schema-Driven Design

The ConfigManager is fully driven by an external schema definition.
The schema defines:
- The allowed keys
- The type of each key
- Default values
- Allowed options for "choice" types

This allows the configuration logic to remain generic and reusable.
Adding a new configuration setting requires only modifying the schema,
without changing the ConfigManager implementation itself.

The schema is assumed to be defined by the application developer and is trusted.
The manager validates configuration values against the schema,
but does not deeply validate the schema structure itself.

---

2) Separation Between Schema and Runtime Values

The class maintains a clear separation between:

- The schema (definition layer)
- Runtime values (state layer)

The schema never changes during execution.
Runtime values represent only explicitly set or loaded values.

Defaults are not stored eagerly in memory.
Instead, they are resolved dynamically via get() or get_all().

This keeps runtime state minimal and prevents duplication of default values.

---

3) Validation Strategy

Validation happens in two places:
- When loading from a file
- When setting a value programmatically

This ensures the system never enters an invalid configuration state.

Validation is strict:
- Unknown keys raise an error.
- Invalid types raise ValueError.
- "choice" values must match allowed options.
- bool is explicitly rejected for int fields (since bool is a subclass of int in Python).

Fail-fast behavior was chosen intentionally to prevent silent misconfiguration.

---

4) Fallback Resolution Logic

The get() method resolves values in the following order:

1. Explicit runtime value
2. Provided default argument
3. Schema-defined default

This makes the behavior predictable and flexible,
while still enforcing schema constraints.

---

5) Complete Snapshot on Save

save() writes the result of get_all() rather than only runtime values.
This guarantees that the saved configuration file is complete and explicit,
including default values.

This makes the saved file self-contained and easier to inspect.

---

6) Reset Behavior

reset(key) sets the runtime value back to the schema default.
The schema itself is not modified.

This keeps reset behavior simple and predictable,
and ensures consistency with get_all() and save().

---

7) Graceful First-Run Behavior

If the configuration file does not exist,
load() does not raise an exception.

This allows the application to start with defaults on first run,
which is a common real-world scenario.

---

Overall Design Goal

The primary goal was to create a small but robust configuration layer
that is:

- Predictable
- Strictly validated
- Easy to extend
- Safe against invalid states
- Clean and readable