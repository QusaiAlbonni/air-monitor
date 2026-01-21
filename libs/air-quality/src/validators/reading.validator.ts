import { AirQualityReading } from '@air-monitor/air-quality/dto/air-quality-reading.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ValidationResult } from './interfaces/validation-result';
import { AirQualityRule } from './rules/air-quality.rule';
import { RULES_LIST_TOKEN } from './constants';

@Injectable()
export class ReadingValidator {
  constructor(
    @Inject(RULES_LIST_TOKEN) private readonly rules: AirQualityRule[],
  ) {}

  //Rule based COR pattern
  validate(reading: AirQualityReading): ValidationResult {
    const failures = this.rules
      .filter((rule) => !rule.isValid(reading))
      .map((rule) => rule.reason ?? 'Unknown');

    return {
      valid: failures.length === 0,
      reasons: failures,
    };
  }
}
