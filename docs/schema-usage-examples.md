# Zod Schema Usage Examples

The `@botking/db` package now exports generated Zod schemas that other packages can consume for validation.

## Import Patterns

### Using the Direct Export Paths

```typescript
// Import specific schemas
import { findManyUserSchema, createOneUserSchema } from "@botking/db/schemas";

// Import JSON helpers for handling Prisma's JSON fields
import {
  JsonValueSchema,
  NullableJsonValue,
} from "@botking/db/schemas/helpers";
```

### Using TypeScript with Type Imports

```typescript
// Import types from the main package
import type { User, Bot } from "@botking/db";

// Import schemas for validation
import { findManyUserSchema } from "@botking/db/schemas";
```

## Validation Examples

```typescript
import { findManyUserSchema } from "@botking/db/schemas";
import { JsonValueSchema } from "@botking/db/schemas/helpers";

// Validate a user query
const userQuery = {
  where: { id: "user123" },
  include: { bots: true },
};

try {
  const validatedQuery = findManyUserSchema.parse(userQuery);
  // Use validatedQuery with Prisma
} catch (error) {
  console.error("Invalid query:", error);
}

// Validate JSON data
const jsonData = { key: "value", nested: { array: [1, 2, 3] } };
const validatedJson = JsonValueSchema.parse(jsonData);
```

## Available Schema Categories

The schemas are organized by operation type:

- `findMany*` - For finding multiple records
- `findUnique*` - For finding single records
- `createOne*` - For creating single records
- `updateOne*` - For updating records
- `deleteOne*` - For deleting records
- Enum schemas for field validation
- Helper schemas for JSON handling

## Notes

- Some generated schemas may have type issues but are still functional for runtime validation
- The main `@botking/db` package exports types and database utilities
- Schemas are available via separate export paths to avoid build conflicts
