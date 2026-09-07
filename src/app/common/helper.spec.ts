import { Helper } from './helper';

describe('Helper (feature-ui-enhancements additions)', () => {
  describe('availabilityRank', () => {
    it('classifies statuses into buckets', () => {
      expect(Helper.availabilityRank('AVBL')).toBe('available');
      expect(Helper.availabilityRank('CURR_AVBL')).toBe('available');
      expect(Helper.availabilityRank('RAC')).toBe('rac');
      expect(Helper.availabilityRank('GNWL')).toBe('waitlist');
      expect(Helper.availabilityRank('RLWL')).toBe('waitlist');
      expect(Helper.availabilityRank('REGRET')).toBe('unavailable');
      expect(Helper.availabilityRank('TRAIN CANCELLED')).toBe('unavailable');
    });
  });

  describe('availabilityScore', () => {
    it('ranks available above rac above waitlist above unavailable', () => {
      const avbl = Helper.availabilityScore('AVBL', '10');
      const rac = Helper.availabilityScore('RAC', '10');
      const wl = Helper.availabilityScore('GNWL', '10');
      const regret = Helper.availabilityScore('REGRET');
      expect(avbl).toBeGreaterThan(rac);
      expect(rac).toBeGreaterThan(wl);
      expect(wl).toBeGreaterThan(regret);
    });

    it('rewards more seats for available', () => {
      expect(Helper.availabilityScore('AVBL', '100')).toBeGreaterThan(
        Helper.availabilityScore('AVBL', '5')
      );
    });
  });

  describe('durationToMinutes / timeToMinutes', () => {
    it('parses HH:mm', () => {
      expect(Helper.durationToMinutes('06:05')).toBe(365);
      expect(Helper.timeToMinutes('13:40')).toBe(820);
    });
    it('handles empty input as max (sorts last)', () => {
      expect(Helper.durationToMinutes('')).toBe(Number.MAX_SAFE_INTEGER);
      expect(Helper.timeToMinutes('')).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('minFare', () => {
    it('returns the cheapest positive fare', () => {
      expect(
        Helper.minFare([{ fare: '1320' }, { fare: '820' }, { fare: '0' }])
      ).toBe(820);
    });
    it('returns max for empty list', () => {
      expect(Helper.minFare([])).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('bestAvailabilityScore', () => {
    it('picks the best class score', () => {
      const list = [
        { status: 'GNWL', seats: '20' },
        { status: 'AVBL', seats: '50' },
      ];
      expect(Helper.bestAvailabilityScore(list)).toBe(
        Helper.availabilityScore('AVBL', '50')
      );
    });
    it('returns -1 for empty list', () => {
      expect(Helper.bestAvailabilityScore([])).toBe(-1);
    });
  });

  describe('predictionBand (Feature 1)', () => {
    it('buckets percentages into bands', () => {
      expect(Helper.predictionBand(95)).toBe('high');
      expect(Helper.predictionBand(80)).toBe('high');
      expect(Helper.predictionBand(65)).toBe('medium');
      expect(Helper.predictionBand(50)).toBe('medium');
      expect(Helper.predictionBand(20)).toBe('low');
    });
    it('returns none for null/undefined/NaN', () => {
      expect(Helper.predictionBand(null)).toBe('none');
      expect(Helper.predictionBand(undefined)).toBe('none');
      expect(Helper.predictionBand(NaN)).toBe('none');
    });
    it('maps to a css class (empty when none)', () => {
      expect(Helper.predictionBandClass(90)).toBe('tu-pred-high');
      expect(Helper.predictionBandClass(null)).toBe('');
    });
  });

  describe('confirmChance (Feature 1)', () => {
    it('prefers RAC->CNF chance for RAC rows', () => {
      expect(Helper.confirmChance({ status: 'RAC', predictionPercentage: 40, racCnfPredictionPercentage: 82 })).toBe(82);
    });
    it('uses general prediction for waitlist', () => {
      expect(Helper.confirmChance({ status: 'GNWL', predictionPercentage: 55, racCnfPredictionPercentage: null })).toBe(55);
    });
    it('returns null when nothing is available', () => {
      expect(Helper.confirmChance({ status: 'AVBL' })).toBeNull();
      expect(Helper.confirmChance(null as any)).toBeNull();
    });
  });

  describe('fare transparency (Feature 2)', () => {
    it('detects a genuine saving', () => {
      expect(Helper.hasFareSaving({ fare: '1320', originalFare: 1690 })).toBe(true);
      expect(Helper.hasFareSaving({ fare: '1320', originalFare: 1000 })).toBe(false);
      expect(Helper.hasFareSaving({ fare: '1320' })).toBe(false);
    });
    it('computes the saving, preferring fareDifference', () => {
      expect(Helper.fareSaving({ fare: '1320', originalFare: 1690, fareDifference: 370 })).toBe(370);
      expect(Helper.fareSaving({ fare: '1320', originalFare: 1690 })).toBe(370);
      expect(Helper.fareSaving({ fare: '1320', originalFare: 1000 })).toBe(0);
    });
  });

  describe('departureWindow (Feature 3)', () => {
    it('classifies times into windows', () => {
      expect(Helper.departureWindow('05:00')).toBe('early');
      expect(Helper.departureWindow('08:50')).toBe('morning');
      expect(Helper.departureWindow('13:40')).toBe('afternoon');
      expect(Helper.departureWindow('22:30')).toBe('night');
      expect(Helper.departureWindow('00:15')).toBe('early');
      expect(Helper.departureWindow('18:00')).toBe('night');
    });
  });
});
