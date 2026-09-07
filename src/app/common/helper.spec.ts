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
});
