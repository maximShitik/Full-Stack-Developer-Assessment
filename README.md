## Full-Stack Developer Assessment (Root)


Overview:
Three independent sections:
- python/
- typescript/
- react/

Requirements:
- Python 3.11+
- Node.js 18+

Notes:
- Each section runs independently.
- 2–3 unit tests per task.
- No node_modules, virtualenv, or build artifacts included.

## Python - ConfigManager (Schema-Driven)

Overview:
A schema-driven configuration manager.
The schema defines allowed keys, types, defaults, and allowed options.

Design Highlights:
- Schema-driven architecture (no code changes needed for new keys)
- Clear separation between schema and runtime values
- Strict validation on load() and set()
- Deterministic fallback resolution:
    1) Runtime value
    2) Provided default
    3) Schema default
- save() writes full snapshot (including defaults)
- Graceful first-run behavior

Run:
cd python
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest -q


## JavaScript — Node Task


Overview:
avaScript implementation demonstrating clean structure,
correct async usage, and proper error handling.

Design Highlights:
- Separation between core logic and I/O
- Consistent async/await usage
- Predictable error handling
- 2–3 focused unit tests

Structure:
- src/
- tests/

Run:
cd typescript
npm install
npm test
npm run dev


## React - Filterable Item List


Overview:
Reusable FilterableList component with filtering,
sorting, URL persistence, and keyboard navigation.

Features:
- Case-insensitive search
- Category filter
- Status multi-select
- Sort by title and date
- Loading & empty states
- Responsive layout
- Debounced search
- URL sync
- Keyboard navigation

Structure:
- components/
- hooks/
- utils/
- tests/

Run:
cd react
npm install
npm test
npm run dev


