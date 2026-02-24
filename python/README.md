# Python — ConfigManager

## Overview

This section implements a schema-driven configuration manager.

The `ConfigManager` loads, validates, manages, and saves application configuration based on a predefined schema.

The goal was to build a small, predictable, and strictly validated configuration layer.

---

## Architecture

### 1. Schema-Driven Design

The configuration behavior is entirely driven by an external schema.

The schema defines:
- Allowed keys
- Type of each key
- Default values
- Allowed options for `choice` types

Adding a new configuration setting requires modifying only the schema.

---

### 2. Separation of Concerns

The class maintains two layers:

- **Schema layer** → immutable definition of configuration structure  
- **Runtime values layer** → values explicitly loaded or set

Defaults are not stored eagerly.  
They are resolved dynamically via `get()` and `get_all()`.

---

### 3. Validation Strategy

Validation occurs in:
- `load()`
- `set()`

Supported types:
- `bool`
- `string`
- `int` (bool explicitly rejected)
- `choice`

Invalid values raise `ValueError` with descriptive messages.

Unknown keys also raise `ValueError`.

The system follows a **fail-fast approach** to prevent invalid configuration states.

---

### 4. Fallback Resolution Logic

`get(key, default)` resolves values in this order:

1. Explicit runtime value
2. Provided default argument
3. Schema default

This guarantees predictable behavior.

---

### 5. Reset & Save Behavior

- `reset(key)` restores a value to its schema default.
- `save()` writes a complete snapshot (`get_all()`), ensuring the saved file is explicit and self-contained.

---

## Assumptions

- The schema is considered valid and trusted.
- The manager validates configuration values but does not deeply validate the schema structure itself.
- If the configuration file does not exist, `load()` returns gracefully and defaults are used.

---

## How to Run

```bash
cd python
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest -q