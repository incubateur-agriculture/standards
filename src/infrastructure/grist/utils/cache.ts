interface CacheEntry<T> {
    value: T
    expiresAt: number
}

export class TtlCache<TKey, TValue> {
    private cache = new Map<TKey, CacheEntry<TValue>>()
    private readonly ttlMs: number

    constructor(ttlMs: number = 5 * 60 * 1000) { // 5 minutes par défaut
        this.ttlMs = ttlMs
    }

    set(key: TKey, value: TValue): void {
        // Si TTL est 0 ou négatif, ne pas stocker la valeur
        if (this.ttlMs <= 0) {
            return
        }
        
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs
        })
    }

    get(key: TKey): TValue | null {
        const entry = this.cache.get(key)
        
        if (!entry) {
            return null
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key)
            return null
        }

        return entry.value
    }

    has(key: TKey): boolean {
        return this.get(key) !== null
    }

    delete(key: TKey): boolean {
        return this.cache.delete(key)
    }

    clear(): void {
        this.cache.clear()
    }

    size(): number {
        // Nettoyer les entrées expirées avant de retourner la taille
        this.cleanup()
        return this.cache.size
    }

    private cleanup(): void {
        const now = Date.now()
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key)
            }
        }
    }

    // Méthode pour obtenir toutes les clés valides (non expirées)
    getValidKeys(): TKey[] {
        this.cleanup()
        return Array.from(this.cache.keys())
    }

    // Méthode pour obtenir toutes les valeurs valides
    getValidValues(): TValue[] {
        this.cleanup()
        return Array.from(this.cache.values()).map(entry => entry.value)
    }
}

// Cache global pour les mappings avec TTL de 10 minutes
export const mappingCache = new TtlCache<number, string>(10 * 60 * 1000)

// Cache global pour les objets MappingProduitHebergement complets avec TTL de 15 minutes
export const fullMappingCache = new TtlCache<number, { id: number; identifiantOutil: string }>(15 * 60 * 1000)
