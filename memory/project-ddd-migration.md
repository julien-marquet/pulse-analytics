---
name: project-ddd-migration
description: Migration DDD en cours — état d'avancement et décisions prises
metadata:
  type: project
---

Migration DDD (brief Claude Desktop) en cours sur le monorepo Turbo (apps/api + apps/ingestion-worker).

**Décisions prises :**
- `packages/events-domain` créé maintenant (décidé hors-scope dans le brief, fait en prérequis)
- `EventRepository` a `save()` + toutes les méthodes de lecture
- Worker aura son propre `EventPrismaRepository` implémentant ce qu'il lui faut
- `Latency` prend désormais un `Timing` (plus 3 dates brutes)
- `Event.create()` garde la même signature publique mais valide via `Timing` en interne
- `Event.fromCandidate(candidate, timing)` est la factory côté worker

**État (2026-06-24) :**
Phase 0 terminée : package créé, path alias configuré, imports apps/api mis à jour, anciens fichiers domain supprimés.
L'utilisateur continue l'implémentation lui-même (approche pédagogique).

Reste à faire dans l'ordre : étape 4 → 1 → 2 → 3 (voir brief).

**Why:** L'utilisateur préfère implémenter lui-même pour apprendre.
**How to apply:** Ne pas implémenter à la place de l'utilisateur, proposer des explications et répondre aux questions ponctuelles.
