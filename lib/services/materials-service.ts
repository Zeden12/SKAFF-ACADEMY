import type { LearningMaterial } from "@/lib/types";
import { learningMaterials } from "@/lib/mock-data/materials";

/**
 * Learning material data access. Mock-backed for now; swap the function bodies for real API
 * calls later without changing any calling UI code.
 */
export const materialsService = {
  async listMaterialsForModules(moduleIds: string[]): Promise<LearningMaterial[]> {
    const idSet = new Set(moduleIds);
    return [...learningMaterials.filter((m) => idSet.has(m.moduleId))].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
  },

  async listMaterialsForModule(moduleId: string): Promise<LearningMaterial[]> {
    return materialsService.listMaterialsForModules([moduleId]);
  },

  async listRecentMaterials(moduleIds: string[], limit = 3): Promise<LearningMaterial[]> {
    const materials = await materialsService.listMaterialsForModules(moduleIds);
    return materials.slice(0, limit);
  },
};
