// Copyrights © 2026 by Worajedt Sitthidumrong

import { describe, expect, it } from 'vitest';
import { defaultState, sensors } from './constants';
import { buildModel, calculateDof, calculateImageDistance, getCropFactor, getDefocusAmount } from './optics';

describe('optics calculations', () => {
  it('computes image distance near focal length for distant subjects', () => {
    const imageDistanceMm = calculateImageDistance(50, 5000);

    expect(imageDistanceMm).toBeGreaterThan(50);
    expect(imageDistanceMm).toBeLessThan(51);
  });

  it('computes a finite near/far DOF range for a normal lens setup', () => {
    const dof = calculateDof(50, 5000, 4, sensors['full-frame'].cocMm);

    expect(dof.nearLimitMm).toBeGreaterThan(4000);
    expect(dof.nearLimitMm).toBeLessThan(4100);
    expect(dof.farLimitMm).toBeGreaterThan(6500);
    expect(dof.farLimitMm).toBeLessThan(6600);
    expect(dof.actualDofMm).toBeGreaterThan(2400);
  });

  it('moves smaller sensors to tighter crop factors', () => {
    expect(getCropFactor(sensors['full-frame'])).toBeCloseTo(1, 3);
    expect(getCropFactor(sensors['aps-c'])).toBeGreaterThan(1.5);
    expect(getCropFactor(sensors.mft)).toBeGreaterThan(2);
  });

  it('builds the default model from the sensor plane origin', () => {
    const model = buildModel(defaultState);

    expect(model.sensor.label).toBe('Full frame');
    expect(model.subjectX).toBeGreaterThan(model.sensorX);
    expect(model.backgroundX).toBeGreaterThan(model.subjectX);
    expect(model.nearLimitMm).toBeLessThan(model.objectFocusDistanceMm);
    expect(model.farLimitMm).toBeGreaterThan(model.objectFocusDistanceMm);
  });

  it('returns low defocus at focus distance and higher defocus away from focus', () => {
    const model = buildModel(defaultState);

    expect(getDefocusAmount(defaultState.focusDistanceM, model)).toBe(0);
    expect(getDefocusAmount(defaultState.backgroundDistanceM, model)).toBeGreaterThan(0.9);
  });
});
