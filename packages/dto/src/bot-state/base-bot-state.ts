import { BotLocation, ActiveStatusEffect, StatusEffect } from "../types";
import { IBotState, BotStateConfig } from "./bot-state-interface";

/**
 * Abstract base class for all bot states
 * Provides common implementation for core bot state functionality
 */
export abstract class BaseBotState implements IBotState {
  protected _id: string;
  protected _energyLevel: number;
  protected _maintenanceLevel: number;
  protected _statusEffects: ActiveStatusEffect[];
  protected _currentLocation: BotLocation;
  protected _experience: number;
  protected _customizations: Map<string, any>;

  constructor(config: BotStateConfig = {}) {
    this._id =
      config.id ||
      `state_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this._energyLevel = Math.max(0, config.energyLevel ?? 100); // Allow enhanced energy levels
    this._maintenanceLevel = Math.max(
      0,
      Math.min(100, config.maintenanceLevel ?? 100)
    );
    this._statusEffects = config.statusEffects ? [...config.statusEffects] : [];
    this._currentLocation = config.currentLocation ?? BotLocation.IDLE;
    this._experience = Math.max(0, config.experience ?? 0);
    this._customizations = config.customizations
      ? new Map(config.customizations)
      : new Map();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get energyLevel(): number {
    return this._energyLevel;
  }

  set energyLevel(value: number) {
    this._energyLevel = Math.max(0, value); // Allow exceeding 100 for enhanced bots
  }

  get maintenanceLevel(): number {
    return this._maintenanceLevel;
  }

  set maintenanceLevel(value: number) {
    this._maintenanceLevel = Math.max(0, Math.min(100, value));
  }

  get statusEffects(): ActiveStatusEffect[] {
    return [...this._statusEffects];
  }

  get currentLocation(): BotLocation {
    return this._currentLocation;
  }

  set currentLocation(location: BotLocation) {
    this._currentLocation = location;
  }

  get experience(): number {
    return this._experience;
  }

  set experience(value: number) {
    this._experience = Math.max(0, value);
  }

  get customizations(): Map<string, any> {
    return new Map(this._customizations);
  }

  // Core state management methods
  public updateEnergy(amount: number): void {
    this._energyLevel = Math.max(0, this._energyLevel + amount); // Allow energy to exceed 100
  }

  public updateMaintenance(amount: number): void {
    this._maintenanceLevel = Math.max(
      0,
      Math.min(100, this._maintenanceLevel + amount)
    );
  }

  public addStatusEffect(effect: ActiveStatusEffect): void {
    // Remove existing effect with same ID if present
    this.removeStatusEffect(effect.id);
    this._statusEffects.push({ ...effect });
  }

  public removeStatusEffect(effectId: string): void {
    this._statusEffects = this._statusEffects.filter(
      (effect) => effect.id !== effectId
    );
  }

  public updateLocation(location: BotLocation): void {
    this._currentLocation = location;
  }

  public addExperience(amount: number): void {
    this._experience = Math.max(0, this._experience + amount);
  }

  public setCustomization(key: string, value: any): void {
    this._customizations.set(key, value);
  }

  public getCustomization(key: string): any {
    return this._customizations.get(key);
  }

  public removeCustomization(key: string): void {
    this._customizations.delete(key);
  }

  // Utility methods
  public isOperational(): boolean {
    return this._energyLevel > 0 && this._maintenanceLevel > 20;
  }

  public needsMaintenance(): boolean {
    return this._maintenanceLevel < 30;
  }

  public getActiveEffectsByType(type: string): ActiveStatusEffect[] {
    return this._statusEffects.filter((effect) => effect.effect === type);
  }

  public calculateEffectiveEnergy(): number {
    let effectiveEnergy = this._energyLevel;

    // Apply status effects
    for (const effect of this._statusEffects) {
      if (effect.effect === StatusEffect.ENERGY_DRAIN) {
        effectiveEnergy -= effect.magnitude;
      } else if (effect.effect === StatusEffect.ENERGY_BOOST) {
        effectiveEnergy += effect.magnitude;
      }
    }

    return Math.max(0, effectiveEnergy); // Allow energy to exceed 100 with effects
  }

  // Serialization methods
  public toJSON(): Record<string, any> {
    return {
      id: this._id,
      energyLevel: this._energyLevel,
      maintenanceLevel: this._maintenanceLevel,
      statusEffects: this._statusEffects,
      currentLocation: this._currentLocation,
      experience: this._experience,
      customizations: Object.fromEntries(this._customizations),
    };
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  // Abstract method to be implemented by subclasses
  public abstract getStateType(): string;
}
