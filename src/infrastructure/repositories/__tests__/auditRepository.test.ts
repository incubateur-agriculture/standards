import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAudit } from '../auditRepository';
import { findAuditByHash } from '@/infrastructure/grist/repositories/auditsGristRepository';

// Mock the gristClient functions
vi.mock('@/infrastructure/grist/repositories/auditsGristRepository', () => ({
    findAuditByHash: vi.fn(),
}));

describe('auditRepository', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks();
    });

    it('should return null when auditHash is null', async () => {
        const result = await getAudit(null);
        expect(result).toBeNull();
        expect(findAuditByHash).not.toHaveBeenCalled();
    });

    it('should return null when audit is not found', async () => {
        vi.mocked(findAuditByHash).mockResolvedValue(null);

        const result = await getAudit('non-existent-hash');
        
        expect(result).toBeNull();
        expect(findAuditByHash).toHaveBeenCalledWith('non-existent-hash');
    });

    it('should return audit when found', async () => {
        const mockAudit = {
            id: 123,
            dateComiteInvestissement: new Date('2021-01-01T00:00:00.000Z'),
            cloture: true,
            clotureLe: new Date('2021-01-02T00:00:00.000Z'),
            produit: {
                id: 456,
                nom: 'Test Product'
            }
        };

        vi.mocked(findAuditByHash).mockResolvedValue(mockAudit);

        const result = await getAudit('valid-hash');

        expect(result).toEqual(mockAudit);
        expect(findAuditByHash).toHaveBeenCalledWith('valid-hash');
    });

    it('should handle error cases gracefully', async () => {
        vi.mocked(findAuditByHash).mockRejectedValue(new Error('API error'));

        await expect(getAudit('error-hash')).rejects.toThrow('API error');
        expect(findAuditByHash).toHaveBeenCalledWith('error-hash');
    });
}); 