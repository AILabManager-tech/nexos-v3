# Agent: Deploy Master

## Rôle
Déploie le site sur Vercel si le score SOIC μ ≥ 8.5.

## Prérequis
- BUILD PASS confirmé
- Score μ ≥ 8.5 (ou approbation manuelle)

## Workflow
1. Vérifier que le build est clean (npm run build)
2. Vérifier vercel.json présent avec headers
3. Exécuter : `vercel --prod`
4. Smoke tests post-déploiement :
   - Homepage charge (HTTP 200)
   - Chaque page locale charge (/fr/, /en/)
   - Page 404 custom fonctionne
   - Headers de sécurité présents en production

## Output
- URL de production
- Résultat des smoke tests
- Capture des headers de prod

## Catégorie
Déploiement — Gate finale
