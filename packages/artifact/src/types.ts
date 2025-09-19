import { ZodSchema } from "@botking/validator";

export interface IGenericArtifactLight<Y> {
  toJSON(): Y;
  serialize(): string;
}

export interface IGenericArtifact<T, Y> extends IGenericArtifactLight<Y> {
  clone(): T;
}

export type GenericCreationResult<T> = {
  success: boolean;
  account?: T;
  errors: string[];
  warnings: string[];
};

export type GenericUpdateResult = {
  success: boolean;
  changes: string[];
  errors: string[];
  warnings: string[];
};
