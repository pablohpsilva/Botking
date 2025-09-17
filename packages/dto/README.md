# @botking/dto

Data Transfer Objects and database abstraction layer for Botking artifacts.

## Overview

The `@botking/dto` package provides a clean separation between your business logic and data persistence layer. It includes:

- **DTO Interfaces**: Type-safe data structures for all artifact entities
- **Factory Classes**: Create and validate DTOs with built-in validation
- **Validation System**: Comprehensive validation with detailed error reporting
- **Modular Architecture**: Clean separation of concerns for scalable development

## Installation

```bash
pnpm add @botking/dto
```

## Features

### DTO Interfaces

Complete type definitions for all artifact entities:

- `SoulChipDTO` - AI core personality and stats
- `SkeletonDTO` - Structural framework data
- `PartDTO` - Modular equipment components
- `ExpansionChipDTO` - Enhancement modules
- `BotStateDTO` - Runtime state and status
- `BotDTO` - Complete bot composition
- `BotTemplateDTO` - Shareable bot configurations
- `CollectionDTO` - Organized artifact collections

### Factory System

Type-safe creation and validation:

```typescript
import { SoulChipDTOFactory, RarityDTO } from "@botking/dto";

const factory = new SoulChipDTOFactory();

// Create with defaults
const soulChip = factory.createDefault({
  userId: "user123",
  name: "Advanced AI Core",
  rarity: RarityDTO.EPIC,
  baseStats: {
    intelligence: 85,
    resilience: 70,
    adaptability: 90,
  },
});

// Validate
const validation = factory.validate(soulChip);
console.log("Valid:", validation.isValid);
```

### Validation System

Comprehensive validation with detailed error reporting:

```typescript
const result = factory.validate(invalidDTO);

if (!result.isValid) {
  result.errors.forEach((error) => {
    console.log(`${error.field}: ${error.message}`);
  });
}
```

## Quick Start

### Basic Usage

```typescript
import { DTOPackage, RarityDTO, SkeletonTypeDTO } from "@botking/dto";

// Initialize the package
const dtoPackage = new DTOPackage();
dtoPackage.initialize();

// Create a soul chip
const soulChip = dtoPackage.factories.soulChip.createDefault({
  userId: "user123",
  name: "Tactical AI",
  rarity: RarityDTO.LEGENDARY,
});

// Create a skeleton
const skeleton = dtoPackage.factories.skeleton.createDefault({
  userId: "user123",
  name: "Heavy Combat Frame",
  type: SkeletonTypeDTO.HEAVY,
  rarity: RarityDTO.EPIC,
});

// Validate
const isValid = dtoPackage.factories.soulChip.validate(soulChip).isValid;
console.log("Valid soul chip:", isValid);
```

### Complete Bot Creation

```typescript
import { DTOExample } from "@botking/dto";

// Create a complete example bot
const bot = DTOExample.createExampleBot();
console.log("Bot created:", bot.name);

// Demonstrate validation features
const demo = DTOExample.demonstrateValidation();
console.log("Valid DTO:", demo.valid.isValid);
console.log("Invalid DTO errors:", demo.invalid.errors);
```

## Architecture

### DTO Interfaces

All DTOs extend base interfaces providing common functionality:

```typescript
interface BaseDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserOwnedDTO extends BaseDTO {
  userId: string;
}

interface MetadataDTO {
  version: number;
  source?: string;
  tags?: string[];
  description?: string;
  metadata?: Record<string, any>;
}
```

### Factory Pattern

Factories provide consistent creation and validation:

```typescript
abstract class BaseDTOFactory<T> {
  abstract createDefault(overrides?: Partial<T>): T;
  abstract createFromData(data: any): T;
  abstract validate(dto: T): ValidationResult;
}
```

### Validation System

Built-in validation with comprehensive error reporting:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}
```

## Available DTOs

### SoulChipDTO

```typescript
interface SoulChipDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  personality: string;
  rarity: RarityDTO;
  baseStats: {
    intelligence: number;
    resilience: number;
    adaptability: number;
  };
  specialTrait: string;
  experiences: string[];
  learningRate: number;
}
```

### PartDTO

```typescript
interface PartDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  category: PartCategoryDTO;
  rarity: RarityDTO;
  stats: CombatStatsDTO;
  abilities: AbilityDTO[];
  upgradeLevel: number;
  currentDurability: number;
  maxDurability: number;
}
```

### BotDTO

```typescript
interface BotDTO extends UserOwnedDTO, MetadataDTO {
  name: string;
  soulChipId: string;
  skeletonId: string;
  partIds: string[];
  expansionChipIds: string[];
  stateId: string;

  // Optional populated relations
  soulChip?: SoulChipDTO;
  skeleton?: SkeletonDTO;
  parts?: PartDTO[];
  expansionChips?: ExpansionChipDTO[];
  state?: BotStateDTO;
}
```

## Configuration

```typescript
interface DTOPackageConfig {
  enableValidation?: boolean;
  enableCaching?: boolean;
  cacheConfig?: {
    ttl: number;
    maxSize: number;
  };
}

const dtoPackage = new DTOPackage({
  enableValidation: true,
  enableCaching: false,
});
```

## Error Handling

The package includes custom error types:

```typescript
import {
  DTOValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "@botking/dto";

try {
  const dto = factory.createFromData(invalidData);
  const validation = factory.validate(dto);

  if (!validation.isValid) {
    throw new DTOValidationError("Invalid DTO", validation.errors);
  }
} catch (error) {
  if (error instanceof DTOValidationError) {
    console.log("Validation errors:", error.errors);
  }
}
```

## Integration with Database

This package provides the foundation for database integration. For actual persistence, you would typically:

1. Create repository implementations using these DTOs
2. Implement mappers to convert between DTOs and entity classes
3. Add service layers for business logic

Example repository interface:

```typescript
interface IRepository<T extends BaseDTO> {
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  findById(id: string): Promise<T | null>;
  findMany(options?: SearchOptions): Promise<PaginatedResponse<T>>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run tests
pnpm test

# Development mode
pnpm run dev
```

## License

MIT
