'use server'

import { Startup } from "@/domain/types"
import { 
  findAllStartups as findAllGristStartups,
  findStartupById as findGristStartupById,
  findStartupsByIncubateur as findGristStartupsByIncubateur,
  findActiveStartups as findGristActiveStartups,
  saveStartup as saveGristStartup
} from "@/infrastructure/grist/repositories/startupsGristRepository"

/**
 * Récupère une startup par son ID
 */
export async function getStartupById(startupId: number): Promise<Startup | null> {
  return findGristStartupById(startupId)
}

/**
 * Récupère toutes les startups
 */
export async function getAllStartups(): Promise<Startup[]> {
  return findAllGristStartups()
}

/**
 * Récupère les startups par incubateur
 */
export async function getStartupsByIncubateur(incubateur: string): Promise<Startup[]> {
  return findGristStartupsByIncubateur(incubateur)
}

/**
 * Récupère les startups actives uniquement
 */
export async function getActiveStartups(): Promise<Startup[]> {
  return findGristActiveStartups()
}

/**
 * Sauvegarde une startup
 */
export async function saveStartup(startup: Startup): Promise<void> {
  return saveGristStartup(startup)
}
