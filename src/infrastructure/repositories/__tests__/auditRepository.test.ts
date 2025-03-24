import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAudit, getPreviousAudit } from '../auditRepository';
import { findAuditByHash, findPreviousAuditByHash } from '@/infrastructure/grist/repositories/auditsGristRepository';

// Mock the gristClient functions
vi.mock('@/infrastructure/grist/repositories/auditsGristRepository', () => ({
    findAuditByHash: vi.fn(),
    findPreviousAuditByHash: vi.fn(),
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

    // Tests for getPreviousAudit
    describe('getPreviousAudit', () => {
        it('should return null when auditHash is null', async () => {
            const result = await getPreviousAudit(123, null);
            expect(result).toBeNull();
            expect(findPreviousAuditByHash).not.toHaveBeenCalled();
        });

        it('should return previous audit when found', async () => {
            const produitId = 456;
            const auditHash = 'valid-hash';
            const mockPreviousAudit = {
                id: 122,
                dateComiteInvestissement: new Date('2020-12-01T00:00:00.000Z'),
                cloture: true,
                clotureLe: new Date('2020-12-02T00:00:00.000Z'),
                produit: {
                    id: produitId,
                    nom: 'Test Product'
                }
            };

            vi.mocked(findPreviousAuditByHash).mockResolvedValue(mockPreviousAudit);

            const result = await getPreviousAudit(produitId, auditHash);

            expect(result).toEqual(mockPreviousAudit);
            expect(findPreviousAuditByHash).toHaveBeenCalledWith(produitId, auditHash);
        });

        it('should return null when no previous audit is found', async () => {
            const produitId = 456;
            const auditHash = 'first-audit-hash';
            
            vi.mocked(findPreviousAuditByHash).mockResolvedValue(null);

            const result = await getPreviousAudit(produitId, auditHash);

            expect(result).toBeNull();
            expect(findPreviousAuditByHash).toHaveBeenCalledWith(produitId, auditHash);
        });

        it('should handle error cases gracefully', async () => {
            const produitId = 456;
            const auditHash = 'error-hash';
            
            vi.mocked(findPreviousAuditByHash).mockRejectedValue(new Error('API error'));

            await expect(getPreviousAudit(produitId, auditHash)).rejects.toThrow('API error');
            expect(findPreviousAuditByHash).toHaveBeenCalledWith(produitId, auditHash);
        });
    });
}); 