import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TtlCache } from '../cache'

describe('TtlCache', () => {
    let cache: TtlCache<string, string>

    beforeEach(() => {
        cache = new TtlCache(100) // 100ms TTL pour les tests
    })

    describe('basic operations', () => {
        it('should set and get values', () => {
            cache.set('key1', 'value1')
            expect(cache.get('key1')).toBe('value1')
        })

        it('should return null for non-existent keys', () => {
            expect(cache.get('nonexistent')).toBeNull()
        })

        it('should check if key exists', () => {
            cache.set('key1', 'value1')
            expect(cache.has('key1')).toBe(true)
            expect(cache.has('nonexistent')).toBe(false)
        })

        it('should delete keys', () => {
            cache.set('key1', 'value1')
            expect(cache.delete('key1')).toBe(true)
            expect(cache.get('key1')).toBeNull()
            expect(cache.delete('nonexistent')).toBe(false)
        })

        it('should clear all keys', () => {
            cache.set('key1', 'value1')
            cache.set('key2', 'value2')
            cache.clear()
            expect(cache.size()).toBe(0)
        })
    })

    describe('TTL behavior', () => {
        it('should return null for expired entries', async () => {
            cache.set('key1', 'value1')
            expect(cache.get('key1')).toBe('value1')

            // Attendre que l'entrée expire
            await new Promise(resolve => setTimeout(resolve, 150))
            
            expect(cache.get('key1')).toBeNull()
        })

        it('should not return expired entries in has()', async () => {
            cache.set('key1', 'value1')
            expect(cache.has('key1')).toBe(true)

            // Attendre que l'entrée expire
            await new Promise(resolve => setTimeout(resolve, 150))
            
            expect(cache.has('key1')).toBe(false)
        })

        it('should clean up expired entries on size()', async () => {
            cache.set('key1', 'value1')
            cache.set('key2', 'value2')
            expect(cache.size()).toBe(2)

            // Attendre que les entrées expirent
            await new Promise(resolve => setTimeout(resolve, 150))
            
            expect(cache.size()).toBe(0)
        })

        it('should return only valid keys', async () => {
            cache.set('key1', 'value1')
            cache.set('key2', 'value2')
            
            // Attendre que key1 expire mais pas key2
            await new Promise(resolve => setTimeout(resolve, 60))
            cache.set('key2', 'value2') // Renouveler key2
            
            await new Promise(resolve => setTimeout(resolve, 60))
            
            const validKeys = cache.getValidKeys()
            expect(validKeys).toContain('key2')
            expect(validKeys).not.toContain('key1')
        })

        it('should return only valid values', async () => {
            cache.set('key1', 'value1')
            cache.set('key2', 'value2')
            
            // Attendre que key1 expire mais pas key2
            await new Promise(resolve => setTimeout(resolve, 60))
            cache.set('key2', 'value2') // Renouveler key2
            
            await new Promise(resolve => setTimeout(resolve, 60))
            
            const validValues = cache.getValidValues()
            expect(validValues).toContain('value2')
            expect(validValues).not.toContain('value1')
        })
    })

    describe('edge cases', () => {
        it('should handle zero TTL', () => {
            const zeroCache = new TtlCache(0)
            zeroCache.set('key1', 'value1')
            expect(zeroCache.get('key1')).toBeNull()
        })

        it('should handle negative TTL', () => {
            const negativeCache = new TtlCache(-1000)
            negativeCache.set('key1', 'value1')
            expect(negativeCache.get('key1')).toBeNull()
        })

        it('should handle very large TTL', () => {
            const longCache = new TtlCache(Number.MAX_SAFE_INTEGER)
            longCache.set('key1', 'value1')
            expect(longCache.get('key1')).toBe('value1')
        })
    })

    describe('concurrent access', () => {
        it('should handle multiple operations safely', () => {
            // Simuler des opérations concurrentes
            for (let i = 0; i < 100; i++) {
                cache.set(`key${i}`, `value${i}`)
            }

            expect(cache.size()).toBe(100)

            // Vérifier que toutes les valeurs sont accessibles
            for (let i = 0; i < 100; i++) {
                expect(cache.get(`key${i}`)).toBe(`value${i}`)
            }
        })
    })
})
